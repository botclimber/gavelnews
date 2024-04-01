import { message } from "../types/types";
// TODO: 
//  - class for cleaner code
//  - we may think of handling unique usernames
export class ChatClassHelper {

    async checkMessagesSizeLimit(messages: string[] | undefined, limit: number): Promise<string[]> {
        const data = messages ?? []
        const sizeDiff = data.length - limit

        const rearrangedData = (sizeDiff > 0)? data.slice(sizeDiff) : data

        return rearrangedData
    }

    async checkMessageContent(message: message ): Promise<message> {

        // implement some checks
        message.message = message.message.trim(); // remove begin and end spaces

        return message
    }

    /**
     * transform a recieved message from Buffer to string
     * 
     * @param message 
     * @returns 
     */
    async parseToString(message: Buffer): Promise<string> { return Buffer.from(message).toString('utf-8') }
}