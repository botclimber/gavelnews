import express, { Request, Response } from 'express';
import { NewsManipulator } from '../../../controllers/News/NewsManipulator';
import { jsonData, loadData, CONTENT_PER_PAGE } from '../../../utils/JsonDataHandler';
import { sortBy, filterBy, getSingleNewData, sliceData, isValidDateFormat } from '../../../controllers/News/NewsHelper';

import { ResponseData, ResponseNewObject, User, UserIdentifier, fromRequestJsonFileFormat, new_object, opinion } from "../../../../../CommonStuff/src/types/types"
import { allUsers } from '../../../../../CommonStuff/src/controllers/UsersUtils';

const GetNewsRouter = express.Router();

GetNewsRouter.get("/:date", async function (req: Request, res: Response) {
    try {
        const userInfo = req.userInfo
        const userIdentifier = req.userIdentifier as UserIdentifier

        const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });

        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });

        const dataToBeSent = (date == "current") ?
            await jsonData.getData(userInfo) :
            await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo)


        res.status(200).json({ "allContentSize": dataToBeSent.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }

});

GetNewsRouter.get("/categories/:date", async (req: Request, res: Response) => {

    const date = req.params.date

    try {
        if (date !== "current" && !isValidDateFormat(date)) {
            return res.status(400).json({ "msg": "Not a valid date" })
        }

        const data: NewsManipulator = (date == "current") ?
            jsonData :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))

        const categories = data.getCategories()

        return res.status(200).json({"cats": Array.from(categories)})

    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": e })
    }
});

GetNewsRouter.get("/:date/:page", async function (req: Request, res: Response) {

    try {

        const userInfo = req.userInfo
        const userIdentifier = req.userIdentifier as UserIdentifier

        await allUsers.registUser(userIdentifier, userInfo)

        const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });


        const date = req.params.date
        const page = parseInt(req.params.page)

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });

        const data = (date == "current") ?
            await jsonData.getData(userInfo) :
            await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo)
        const dataToBeSent: ResponseData = sliceData(data, page, CONTENT_PER_PAGE)

        res.status(200).json({ "allContentSize": data.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
});

GetNewsRouter.get("/:date/sortBy/:param/:page", async function (req: Request, res: Response) {

    try {

        const userInfo = req.userInfo
        const userIdentifier = req.userIdentifier as UserIdentifier

        const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });

        const param = req.params.param as keyof ResponseNewObject
        const page = parseInt(req.params.page)
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });
        if (!(param in jsonData.data.data[0])) return res.status(400).json({ "msg": `${param} key not valid!` });

        const data = (date == "current") ?
            await jsonData.getData(userInfo) :
            await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo)
        const sortData = sortBy(data, param);
        const dataToBeSent = sliceData(sortData, page, CONTENT_PER_PAGE);

        return res.status(200).json({ "allContentSize": data.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
});

GetNewsRouter.get("/:date/filterBy/:param/:value/:page", async function (req: Request, res: Response) {

    try {
        const userInfo = req.userInfo
        const userIdentifier = req.userIdentifier as UserIdentifier

        const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });

        const param = req.params.param as keyof ResponseNewObject
        const value = req.params.value
        const page = parseInt(req.params.page)
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });
        if (!(param in jsonData.data.data[0])) return res.status(400).json({ "msg": `${param} key not valid!` });

        const data = (date == "current") ?
            await jsonData.getData(userInfo) :
            await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo)

        const filteredData = filterBy(data, param, value);
        const dataToBeSent = sliceData(filteredData, page, CONTENT_PER_PAGE);
        return res.status(200).json({ "allContentSize": filteredData.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
});

GetNewsRouter.get("/:date/sortFilterBy/:sortParam/:filterParam/:filterValue/:page", async function (req: Request, res: Response) {

    try {
        const userInfo = req.userInfo
        const userIdentifier = req.userIdentifier as UserIdentifier

        const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });

        const sortParam = req.params.sortParam as keyof ResponseNewObject
        const filterParam = req.params.filterParam as keyof ResponseNewObject
        const filterValue = req.params.filterValue
        const page = parseInt(req.params.page)
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });
        if (!(filterParam in jsonData.data.data[0]) || !(sortParam in jsonData.data.data[0])) return res.status(400).json({ "msg": `SORT_PARAm:${sortParam} or FILTER_PARAM:${filterParam} key not valid!` });

        const data = (date == "current") ?
            await jsonData.getData(userInfo) :
            await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo)

        const filteredData = filterBy(data, filterParam, filterValue);
        const sortData = sortBy(filteredData, sortParam);
        const dataToBeSent = sliceData(sortData, page, CONTENT_PER_PAGE);

        return res.status(200).json({ "allContentSize": filteredData.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
});

GetNewsRouter.get("/:date/getNew/:id", async (req: Request, res: Response) => {

    const id = req.params.id
    const date = req.params.date
    console.log(`trying to retrieve new with id ${id}`)

    try {

        const userInfo = req.userInfo
        const userIdentifier = req.userIdentifier as UserIdentifier

        const userBlocked = await allUsers.checkRemoveExpiredBlock(userIdentifier, userInfo)
        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });

        if (date !== "current" && !isValidDateFormat(date)) {
            return res.status(400).json({ "msg": "Not a valid date" })
        }

        const data = (date == "current") ?
            await jsonData.getData(userInfo) :
            await (new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))).getData(userInfo)

        const newData = getSingleNewData(data, id)
        return res.status(200).json(newData)

    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": e })
    }
});

export default GetNewsRouter;
