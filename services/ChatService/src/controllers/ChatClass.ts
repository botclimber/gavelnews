import * as WebSocket from 'ws';
import { ChatClassHelper } from './ChatClassHelper';
import { message } from "../../../CommonStuff/src/types/types";
import { pathMainData, pathBackupData, dateFormat, pathChatsData } from "../../../CommonStuff/src/consts/consts";
import { formatDate, getPreviousDate } from "../../../CommonStuff/src/functions/functions";

type chatCode = string

// Define a class for the chat service
export class ChatClass {

  // TODO: print messagesMemory and chatClientsMap memory occupation
  private MESSAGES_LIMIT_PER_CHAT: number = 5
  private wss: WebSocket.Server
  private messagesMemory: Map<chatCode, string[]>
  private chatClientsMap: Map<chatCode, WebSocket[]>
  private helper: ChatClassHelper

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.messagesMemory = new Map();
    this.chatClientsMap = new Map();
    this.helper = new ChatClassHelper()
    this.setupWebSocket();
  }

  /**
   * Setup WebSocket
   */
  private setupWebSocket() {

    try {
      this.wss.on('connection', (ws: WebSocket, req) => {

        // Extract chat code from URL
        const urlParts = req.url?.split('/');
        const chatCode = (urlParts && urlParts.length > 1 && urlParts[1] !== "") ? urlParts[1] : "/"; // Assuming "/" as default chat code if none specified

        this.connectClientToChat(ws, chatCode)
        this.onConnection(ws, chatCode)

        // Event handler for receiving messages
        ws.on('message', async (message: Buffer | string) => {

          const ensureStringType: string = (message instanceof Buffer) ? await this.helper.parseToString(message) : message
          const messageAsObject: message = JSON.parse(ensureStringType)

          const cleanMessageContent: message = await this.helper.checkMessageContent(messageAsObject);

          console.log(`Message is: ${cleanMessageContent}`)
          if (cleanMessageContent.message !== "") {

            const messageAsString = JSON.stringify(cleanMessageContent)

            this.addMessageToChat(messageAsString, chatCode)
            this.checkHowManyMessagesSent(chatCode)
            this.broadcast(messageAsString, chatCode); // Broadcast the message to all clients
            this.broadcastChatsStatus()

          }
        });

        // Event handler for closing connection
        ws.on('close', () => {

          /* Handle client chat connection by removing him */
          const index = this.chatClientsMap.get(chatCode)?.indexOf(ws)

          // remove client
          if (index !== undefined && index !== -1) this.chatClientsMap.get(chatCode)?.splice(index, 1)

          // if empty remove chat/room
          if (this.chatClientsMap.get(chatCode)?.length == 0) this.chatClientsMap.delete(chatCode);
          /* --- */

          console.log('Client disconnected');
          console.log(this.chatClientsMap)

        });
      });
    } catch (e) {
      console.log(this.setupWebSocket.toString)
      console.log(e)
    }
  }

  /**
   * connect client to specific chat
   * 
   * @param ws 
   * @param chatCode 
   */
  private connectClientToChat(ws: WebSocket, chatCode: chatCode): void {
    try {
      const checkIfChatAlreadySet = this.chatClientsMap.get(chatCode)

      if (checkIfChatAlreadySet == undefined) this.chatClientsMap.set(chatCode, [ws])
      else {
        if (!this.chatClientsMap.get(chatCode)?.includes(ws)) {
          console.log("client is not included on this chat yet!")
          this.chatClientsMap.get(chatCode)?.push(ws);
        }
      }

    } catch (e) {
      console.log(this.connectClientToChat.toString)
      console.log(e)
    }
  }

  /**
   * add message to specific chat, so we can perfome checks on chat individually
   * 
   * @param message 
   * @param chatCode 
   */
  private async addMessageToChat(message: string, chatCode: chatCode): Promise<void> {
    // TODO: verify if message already reached limit

    try {
      const checkIfMessageMemoryExists = this.messagesMemory.get(chatCode)

      if (checkIfMessageMemoryExists == undefined) this.messagesMemory.set(chatCode, [message])
      else {

        this.messagesMemory.get(chatCode)?.push(message)

        const messages = this.messagesMemory.get(chatCode)
        const rearrangedMessages = await this.helper.checkMessagesSizeLimit(messages, this.MESSAGES_LIMIT_PER_CHAT)

        this.helper.saveMessagesToFile(rearrangedMessages.slicedData, `${pathChatsData}${chatCode}_${formatDate(getPreviousDate(1), dateFormat)}.txt`)
        this.messagesMemory.set(chatCode, rearrangedMessages.rearrangedData)
      }

    } catch (e) {
      console.log(this.addMessageToChat.toString)
      console.log(e)
    }
  }

  /**
   * Broadcast messages to clients, for specific chat
   * 
   * @param message 
   * @param chatCode 
   */
  private broadcast(message: string, chatCode: string) {
    try {
      this.chatClientsMap.get(chatCode)?.map(client => {

        if (client.readyState === WebSocket.OPEN) {

          client.send(message);
        }
      })

    } catch (e) {
      console.log(this.broadcast.toString)
      console.log(e)
    }
  }

  /**
   * Check how many messages a specific chat has
   * 
   * @param chatCode 
   */
  private checkHowManyMessagesSent(chatCode: string) {
    const messages = this.messagesMemory.get(chatCode)?.length
    console.log(`This Chat (${chatCode}) already has: ${messages} messages`)
  }

  /**
   * does something on client connection, in this case is sent all existing messages for specific chat
   * 
   * @param ws 
   * @param chatCode 
   */
  private async onConnection(ws: WebSocket, chatCode: chatCode) {
    try {

      const messages: string[] = this.messagesMemory.get(chatCode) ?? []
      console.log(`sending messages to client:`)
      console.log(messages)

      ws.send(JSON.stringify(messages))
      this.broadcastChatsStatus()

    } catch (e) {
      console.log(this.onConnection.toString)
      console.log(e)
    }
  }

  private async broadcastChatsStatus() {
    const chatsStatus: { [key: string]: boolean } = Array.from(this.messagesMemory.entries())
      .reduce((acc, [chatCode, messages]) => {
        acc[chatCode] = (messages.length > 0) ? true : false;
        return acc;
      }, {} as { [key: string]: boolean });

    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ "chatsStatus": chatsStatus }))
    })

  }

  async closeDay(): Promise<void> {

    try {

      this.messagesMemory.forEach((messages, key) => {
        if (key !== "/" && messages.length > 0) {
          //const date = getPreviousDate(2)
          const date = getPreviousDate(1) // for test purposes

          this.helper.saveMessagesToFile(messages, `${pathChatsData}${key}_${formatDate(date, dateFormat)}.txt`)
        }
      })

      this.chatClientsMap = new Map();
      this.messagesMemory = new Map();

    } catch (e) {
      console.log(e)
      throw e
    }
  }
}