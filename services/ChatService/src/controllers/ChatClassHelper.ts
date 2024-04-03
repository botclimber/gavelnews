import { message } from "../../../CommonStuff/src/types/types";
import { saveToFile } from "../../../CommonStuff/src/functions/functions";
// TODO: 
//  - class for cleaner code
//  - we may think of handling unique usernames
export class ChatClassHelper {

    HTML_RE = /<[^>]*>/g
    URL_RE = /\b(?:https?|ftp):\/\/(?:www\.)?[^\s<>()]+|\bwww\.[^\s<>()]+|\b(?<!:\/\/)\b[^\s<>()]+\.[^\s<>()]+/gi

    /**
     * TODO: excess messages save to a file named (chat-${chatCode}) discuss extension
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

    async checkMessageContent(message: message): Promise<message> {

        // Remove HTML tags
        message.message = message.message.replace(this.HTML_RE, '');

        // Remove various forms of URLs
        //message.message = message.message.replace(this.URL_RE, ''); // discuss if makes sense block of url/links. We may think of using AI to filter suspicious url/links

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

    async saveMessagesToFile( messages: string[], path: string): Promise<void>{

        try{
            for (let x of messages){
               await saveToFile(x, path, true)
            }
            
        }catch(e){
            console.log(e)
            throw e
        }
    }
}