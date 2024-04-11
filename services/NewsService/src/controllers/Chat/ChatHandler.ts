import { loadFromFile, filesFromFolder, transform } from "../../../../CommonStuff/src/functions/functions";
import { pathChatsData } from "../../../../CommonStuff/src/consts/consts";
import { message } from "../../../../CommonStuff/src/types/types";

export class ChatHandlerClass {

    private chatCode: string
    private date: string
    private path: string

    constructor(chatCode: string, date: string) {

        this.chatCode = chatCode
        this.date = date
        this.path = `${pathChatsData}${chatCode}_${date}.txt`

    }

    async getMessages(): Promise<message[]> {

        const dataFromFile = loadFromFile(this.path)

        const messages = await transform<message>(dataFromFile)

        return messages
    }

    async getChatsStatus(): Promise<string[]> {

        try {
            const files = await filesFromFolder(pathChatsData)

            // Filter files based on the date postfix
            const filteredFiles = files.filter(fileName => fileName.endsWith(`_${this.date}.txt`));

            const chatCodes = filteredFiles.map(element => {
                const chatCode = element.split("_")[0]
                return chatCode
            })

            return chatCodes

        } catch (error) {
            console.log(error)
            return [];
        }

    }

}