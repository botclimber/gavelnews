import express, { Request, Response } from 'express';
import { NewsManipulator } from '../../../controllers/NewsManipulator';
import { jsonData, loadData, CONTENT_PER_PAGE } from '../../../utils/JsonDataHandler';
import { search, sliceData, isValidDateFormat } from '../../../controllers/NewsHelper';

const PostNewsRouter = express.Router();

PostNewsRouter.post("/:date/search/:page", async (req: Request, res: Response) => {
    const userInfo = req.userInfo

    try {

        const title = req.body.title ?? ""
        const page = parseInt(req.params.page)
        const date = req.params.date

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});
        if (isNaN(page) || page <= 0) return res.status(400).json({"msg": `Invalid page number ${page}`});
        if(title === "") return res.status(400).json({"msg": "Invalid request, either no title param or empty!"});

        const data = (date == "current")? 
        await jsonData.getData(userInfo) :
        await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo);

        const matchedNews = search(data, title)
        const dataToBeSent = sliceData(matchedNews, page, CONTENT_PER_PAGE)
        return res.status(200).json({ "allContentSize": matchedNews.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": e })
    }
})

export default PostNewsRouter;
