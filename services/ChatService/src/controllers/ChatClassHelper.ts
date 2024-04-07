import { message } from "../../../CommonStuff/src/types/types";
import { saveToFile } from "../../../CommonStuff/src/functions/functions";

type ReservedUsernames = { [key: string]: string}

export class ChatClassHelper {

    private USERNAME_CHAT_LIMIT = 15;
    private RESERVED_USERNAMES: ReservedUsernames[] = [
        {"#greedisgood": "CEO"}, 
        {"#greedisgood": "CTO"}, 
        {"#greedisgood": "CFO"},
        {"#greedisgood": "Catarina"}, 
        {"#greedisgood": "Daniel"}];

    HTML_RE: RegExp = /<[^>]*>/g;
    URL_RE: RegExp = /\b(?:https?|ftp):\/\/(?:www\.)?[^\s<>()]+|\bwww\.[^\s<>()]+|\b(?<!:\/\/)\b[^\s<>()]+\.[^\s<>()]+/gi;

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

    async checkMessageContent(message: message["message"]): Promise<message["message"]> {

        // Remove HTML tags
        message = message.replace(this.HTML_RE, '');

        // Remove various forms of URLs
        //message.message = message.message.replace(this.URL_RE, ''); // discuss if makes sense block of url/links. We may think of using AI to filter suspicious url/links

        // implement some checks
        message = message.trim(); // remove begin and end spaces

        return message
    }

    async checkMessageUsername (username: message["user"]): Promise<message["user"]> {

        username = username.replace(this.HTML_RE, "");
        username = username.replace(this.URL_RE, "");

        for (const item of this.RESERVED_USERNAMES) {
            const key = Object.keys(item)[0]; // Extracting the key
            const value = item[key]; // Extracting the value

            if (username.includes(value)) {
                if(username.includes(key)) username = username.replace(key, "");
                else username = "";
                
            }
        }

        username = username.substring(0, this.USERNAME_CHAT_LIMIT);
        username = username.trim();

        return username
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