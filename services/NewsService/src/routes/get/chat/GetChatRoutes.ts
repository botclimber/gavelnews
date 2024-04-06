import express, { Request, Response } from 'express';
import { ChatClass } from '../../../controllers/ChatHandler';

const GetChatRouter = express.Router();

GetChatRouter.get("/old/chats/:date/:chatId", async (req: Request, res: Response) => {

    const chatCode = req.params.chatId
    const date = req.params.date

    try {
        const handler = new ChatClass(chatCode, date)

        if (chatCode === "*") {

            const chatsStatus = await handler.getChatsStatus()
            return res.status(200).json({ "chatsStatus": chatsStatus })

        } else {

            const messages = await handler.getMessages();
            return res.status(200).json(messages)

        }

    } catch (e: any) {
        switch (e.code) {
            case "ENOENT": return res.status(500).json({ "msg": "Chat is empty!" }); break;
            default: return res.status(500).json({ "msg": e.message });
        }
    }

})

export default GetChatRouter;