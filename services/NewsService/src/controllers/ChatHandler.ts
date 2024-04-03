import { loadFromFile } from "../../../CommonStuff/src/functions/functions";
import { pathChatsData } from "../../../CommonStuff/src/consts/consts";
import { message } from "../../../CommonStuff/src/types/types";

export class ChatClass {

    private chatCode: string
    private date: string
    private path: string

    constructor(chatCode: string, date: string) {

        this.chatCode = chatCode
        this.date = date
        this.path = `${pathChatsData}${chatCode}_${date}.txt`

    }

    async getMessages(): Promise<string>{

        const dataFromFile = loadFromFile(this.path)

        const messages = await this.transform(dataFromFile)

        return JSON.stringify(messages)
    }

    async transform(data: string): Promise<message[]> {

        try {
            const lines = data.split('\n').filter(element => element !== "");
            const messages: message[] = lines.map(line => JSON.parse(line.trim()));

            return messages;
            
        } catch (e) {
            throw e
        }
    }

}