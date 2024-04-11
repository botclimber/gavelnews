import { message, ReservedUsername, UserInfo } from "../../../../CommonStuff/src/types/types";
import { saveToFile } from "../../../../CommonStuff/src/functions/functions";

export class ChatClassHelper {

    private USERNAME_CHAT_LIMIT = 15;
    private reserved_usernames: Set<ReservedUsername>;

    HTML_RE: RegExp = /<[^>]*>/g;
    URL_RE: RegExp = /\b(?:https?|ftp):\/\/(?:www\.)?[^\s<>()]+|\bwww\.[^\s<>()]+|\b(?<!:\/\/)\b[^\s<>()]+\.[^\s<>()]+/gi;

    constructor() {
        this.reserved_usernames = new Set([
            { "#greedisgood": "CEO" },
            { "#greedisgood": "System" },
            { "#greedisgood": "CTO" },
            { "#greedisgood": "CFO" },
            { "#greedisgood": "Catarina" },
            { "#greedisgood": "Daniel" }]);
    }

    /**
     * Excess messages save to a file named (chat-${chatCode}) discuss extension
     * persist in memory only the last {limit} number of messages
     * 
     * @param messages 
     * @param limit 
     * @returns 
     */
    async checkMessagesSizeLimit(messages: string[] | undefined, limit: number): Promise<{ rearrangedData: string[], slicedData: string[] }> {
        const data = messages ?? []
        const sizeDiff = data.length - limit

        const rearrangedData = (sizeDiff > 0) ? data.slice(sizeDiff) : data
        const slicedData = (sizeDiff > 0) ? data.slice(0, sizeDiff) : []

        return { rearrangedData, slicedData }
    }

    async checkMessageContent(message: message["message"]): Promise<message["message"]> {

        // Remove HTML tags
        message = message.replace(this.HTML_RE, '');

        // Remove various forms of URLs
        //message.message = message.message.replace(this.URL_RE, ''); // discuss if makes sense block of url/links. We may think of using AI to filter suspicious url/links

        // implement some checks
        message = message.trim(); // remove begin and end spaces

        return message
    }

    async checkMessageUsername(username: message["usernameId"]): Promise<message["usernameId"]> {

        var usernameKey = Object.keys(username)[0]
        var usernameValue = username[usernameKey]

        const unchangedUsername = usernameValue;

        usernameValue = usernameValue.replace(this.HTML_RE, "");
        usernameValue = usernameValue.replace(this.URL_RE, "");

        if (unchangedUsername !== usernameValue) {
            return { [usernameKey]: "" }
        }

        usernameValue = usernameValue.substring(0, this.USERNAME_CHAT_LIMIT);
        usernameValue = usernameValue.trim();

        for (const item of this.reserved_usernames) {

            const key = Object.keys(item)[0]; // Extracting the key
            const value = item[key]; // Extracting the value

            if (usernameValue == value) {
                if (usernameKey == key) return { [usernameKey]: usernameValue };
                else return { [usernameKey]: "" };

            } else this.reserved_usernames.add({ [usernameKey]: usernameValue })
        }

        return { [usernameKey]: usernameValue };
    }

    /**
     * transform a recieved message from Buffer to string
     * 
     * @param message 
     * @returns 
     */
    async parseToString(message: Buffer): Promise<string> { return Buffer.from(message).toString('utf-8') }

    async saveMessagesToFile(messages: string[], path: string): Promise<void> {

        try {
            for (let x of messages) {
                await saveToFile(x, path, true)
            }

        } catch (e) {
            console.log(e)
            return;
        }
    }

    // TODO:
    // add username and userImg if userInfo !undefined
    // remove token before broadcast
    // mask usernameId key before broadcast
    // add userType (if token ? knownUser : guest)
    async reworkMessageObject(message: message, userInfo?: UserInfo): Promise<message> {
        // Create a new message object to avoid modifying the original
        const modifiedMessage: message = { ...message };

        // Add username and userImg if userInfo is not undefined
        if (userInfo) {
            modifiedMessage.username = userInfo.fullName;
            modifiedMessage.userImg = userInfo.img;
        }

        // Remove token before broadcast
        delete modifiedMessage.token;

        // Mask usernameId key before broadcast
        const maskedUsernameId: ReservedUsername = {"*": message.usernameId[Object.keys(message.usernameId)[0]]};
        modifiedMessage.usernameId = maskedUsernameId;

        // Add userType (if token exists ? knownUser : guest)
        modifiedMessage.userType = message.token ? 'knownUser' : 'guest';

        return modifiedMessage;
    }
}