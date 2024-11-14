import * as WebSocket from 'ws';
import { ChatClassHelper } from './ChatClassHelper';
import { User, UserIdentifier, message } from "../../../../CommonStuff/src/types/types";
import { pathMainData, pathBackupData, dateFormat, pathChatsData, fullDateFormat } from "../../../../CommonStuff/src/consts/consts";
import { calculateFutureDate, formatDate, getPreviousDate } from "../../../../CommonStuff/src/functions/functions";
import { allUsers } from "../../../../CommonStuff/src/controllers/UsersUtils";
import { GoogleAuth } from "../../../../CommonStuff/src/controllers/GoogleAuthUtils";
import https from "https";
import http from "http";

type chatCode = string;
const googleUtils = new GoogleAuth();

// Environment configuration constants
const CONFIG = {
    MESSAGES_LIMIT_PER_CHAT: 25, // process.env.MESSAGES_LIMIT_PER_CHAT
    MESSAGE_RATE_LIMIT: 10, // process.env.MESSAGE_RATE_LIMIT Max messages allowed per second per client
    MESSAGE_RATE_LIMIT_WINDOW: 1000, // process.env.MESSAGE_RATE_LIMIT_WINDOW 1 second window
    REPEATED_MESSAGES_SPAM: 5, // process.env.REPEATED_MESSAGES_SPAM
    MESSAGE_BLOCK_TIME: 1 // process.env.MESSAGE_BLOCK_TIME 1 min
};

// Define a class for the chat service
export class ChatClass {
    private wss: WebSocket.Server;
    private messagesMemory = new Map<chatCode, string[]>();
    private chatClientsMap = new Map<chatCode, WebSocket[]>();
    private messageRate = new Map<WebSocket, { lastMessageTime: number[] }>();
    private helper = new ChatClassHelper();

    constructor(server: http.Server | https.Server) {
        this.wss = new WebSocket.Server({ server });
        this.setupWebSocket();
    }

    /**
     * Initialize WebSocket connection setup and listeners
     */
    private setupWebSocket() {
        this.wss.on('connection', (ws: WebSocket, req) => {
            console.log("New user connected!");
            const userIdentifier = this.getUserIdentifier(req);
            const chatCode = this.extractChatCode(req.url);
            this.connectClientToChat(ws, chatCode);
            this.handleConnection(ws, chatCode);

            // Initialize message rate tracking for rate limiting
            this.messageRate.set(ws, { lastMessageTime: [] });

            // Set up message handling and disconnection events
            this.setupMessageHandler(ws, chatCode, userIdentifier);
            this.setupDisconnectionHandler(ws, chatCode);
        });
    }

    /**
     * Extract user identifier from request headers
     */
    private getUserIdentifier(req: http.IncomingMessage): UserIdentifier {
        return {
            ip: req.socket.remoteAddress ?? "",
            userAgent: req.headers['user-agent'] ?? ""
        };
    }

    /**
     * Extract chat code from URL
     */
    private extractChatCode(url?: string): chatCode {
        const urlParts = url?.split('/');
        return urlParts && urlParts.length > 1 && urlParts[1] !== "" ? urlParts[1] : "/";
    }

    /**
     * Connect a client to a specific chat
     */
    private connectClientToChat(ws: WebSocket, chatCode: chatCode): void {
        const clients = this.chatClientsMap.get(chatCode) ?? [];
        if (!clients.includes(ws)) {
            clients.push(ws);
            this.chatClientsMap.set(chatCode, clients);
        }
    }

    /**
     * Handle WebSocket message event, including rate limiting and spam checks
     */
    private setupMessageHandler(ws: WebSocket, chatCode: chatCode, userIdentifier: UserIdentifier) {
        ws.on('message', async (message) => {
            const parsedMessage = await this.parseIncomingMessage(message);
            const userInfo = parsedMessage.token ? await googleUtils.checkGoogleToken(parsedMessage.token) : undefined;

            // Perform rate limiting and spam checks
            if (await this.checkRateLimit(ws, userIdentifier, chatCode, parsedMessage, userInfo)) return;
            if (await this.checkRepeatedMessages(chatCode, parsedMessage, userIdentifier)) return;

            // Process message if the user is not blocked
            if (await this.processMessage(ws, parsedMessage, userIdentifier, userInfo, chatCode)) {
                this.broadcastToAllClients(chatCode, JSON.stringify(parsedMessage));
            }
        });
    }

    /**
     * Parse and validate incoming WebSocket message
     */
    private async parseIncomingMessage(message: Buffer | string): Promise<message> {
        const ensureStringType: string = message instanceof Buffer ? await this.helper.parseToString(message) : message;
        const messageObj: message = JSON.parse(ensureStringType);
        messageObj.message = await this.helper.checkMessageContent(messageObj.message);
        messageObj.usernameId = await this.helper.checkMessageUsername(messageObj.usernameId);
        return messageObj;
    }

    /**
     * Rate limiting logic: block users who exceed limits
     */
    private async checkRateLimit(ws: WebSocket, userIdentifier: UserIdentifier, chatCode: chatCode, parsedMessage: message, userInfo?: User) {
        const currentTime = Date.now();
        const rateData = this.messageRate.get(ws);
        const lastMessages = rateData?.lastMessageTime.filter(time => currentTime - time < CONFIG.MESSAGE_RATE_LIMIT_WINDOW) || [];

        if (lastMessages.length >= CONFIG.MESSAGE_RATE_LIMIT) {
            await this.blockUser("Rate limiting exceeded", userIdentifier, userInfo);
            return true;
        }
        rateData?.lastMessageTime.push(currentTime);
        return false;
    }

    /**
     * Spam check: block users who send repeated messages too frequently
     */
    private async checkRepeatedMessages(chatCode: chatCode, parsedMessage: message, userIdentifier: UserIdentifier) {
        const chatMessages = this.messagesMemory.get(chatCode) || [];
        const repeatedMessages = chatMessages.filter(msg => JSON.parse(msg).message === parsedMessage.message);
        if (repeatedMessages.length > CONFIG.REPEATED_MESSAGES_SPAM) {
            await this.blockUser("Repeated messages limit exceeded", userIdentifier);
            return true;
        }
        return false;
    }

    /**
     * Process message, checking if user is blocked and handling message storage/broadcast
     */
    private async processMessage(ws: WebSocket, parsedMessage: message, userIdentifier: UserIdentifier, userInfo: User | undefined, chatCode: chatCode) {
        const userStatus = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo);
        if (userStatus?.block.status) {
            this.broadcastToOne(ws, `<span class="text-[10pt] text-orange-400 italic">(${parsedMessage.usernameId[Object.keys(parsedMessage.usernameId)[0]]}) you are blocked [blockTimeUntil: ${userStatus.block.time}].</span>`);
            return false;
        }

        await this.storeAndBroadcastMessage(chatCode, parsedMessage, userIdentifier, userInfo);
        return true;
    }

    /**
     * Store message in memory and broadcast to all clients
     */
    private async storeAndBroadcastMessage(chatCode: chatCode, parsedMessage: message, userIdentifier: UserIdentifier, userInfo?: User) {
        const messageString = JSON.stringify(await this.helper.reworkMessageObject(parsedMessage, userInfo));
        await allUsers.incrementChatMessage(userIdentifier, userInfo);
        this.addMessageToChatMemory(chatCode, messageString);
        this.broadcastChatsStatus();
    }

    /**
     * Add a message to chat memory and persist to disk if limit exceeded
     */
    private async addMessageToChatMemory(chatCode: chatCode, message: string) {
        const messages = this.messagesMemory.get(chatCode) || [];
        messages.push(message);
        this.messagesMemory.set(chatCode, messages.slice(-CONFIG.MESSAGES_LIMIT_PER_CHAT));

        if (chatCode !== "/") {
            const slicedData = messages.slice(0, messages.length - CONFIG.MESSAGES_LIMIT_PER_CHAT);
            await this.helper.saveMessagesToFile(slicedData, `${pathChatsData}${chatCode}_${formatDate(getPreviousDate(1), dateFormat)}.txt`);
        }
    }

    /**
     * Broadcast a message to all clients in a specific chat
     */
    private broadcastToAllClients(chatCode: chatCode, message: string) {
        this.chatClientsMap.get(chatCode)?.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.send(message);
        });
    }

    /**
     * Broadcast message to a specific client
     */
    private broadcastToOne(client: WebSocket, message: string) {
        if (client.readyState === WebSocket.OPEN) client.send(message);
    }

    /**
     * Check chat message count
     */
    private checkHowManyMessagesSent(chatCode: chatCode) {
        console.log(`Chat (${chatCode}) has ${this.messagesMemory.get(chatCode)?.length} messages`);
    }

    /**
     * Close chat and clear memory data at end of day
     */
    async closeDay() {
        await this.persistDataToDisk();
        this.chatClientsMap.clear();
        this.messagesMemory.clear();
    }

    /**
     * Persist data in memory to disk
     */
    private async persistDataToDisk() {
        for (const [key, messages] of this.messagesMemory) {
            if (key !== "/" && messages.length > 0) {
                await this.helper.saveMessagesToFile(messages, `${pathChatsData}${key}_${formatDate(getPreviousDate(2), dateFormat)}.txt`);
            }
        }
    }

    /**
     * Block a user with specified reason
     */
    private async blockUser(reason: string, userIdentifier: UserIdentifier, userInfo?: User) {
        console.log(`${reason} for IP: ${userIdentifier.ip}`);
        await allUsers.blockUser(userIdentifier, userInfo, CONFIG.MESSAGE_BLOCK_TIME);
    }
}