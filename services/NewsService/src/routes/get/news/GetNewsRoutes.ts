import express, { Request, Response } from 'express';
import { NewsManipulator } from '../../../controllers/NewsManipulator';
import { jsonData, loadData, CONTENT_PER_PAGE } from '../../../utils/JsonDataHandler';
import { sortBy, filterBy, getSingleNewData, sliceData, isValidDateFormat } from '../../../controllers/NewsHelper';

import { fromRequestJsonFileFormat, new_object, opinion } from "../../../../../CommonStuff/src/types/types"

const GetNewsRouter = express.Router();

GetNewsRouter.get("/:date", function (req: Request, res: Response) {

    try {
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });

        const dataToBeSent = (date == "current") ?
            jsonData.data :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data


        res.status(200).json({ "allContentSize": dataToBeSent.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }

})

GetNewsRouter.get("/:date/:page", function (req: Request, res: Response) {

    try {
        const date = req.params.date
        const page = parseInt(req.params.page)

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });

        const data = (date == "current") ?
            jsonData.data :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data
        const dataToBeSent: fromRequestJsonFileFormat = sliceData(data, page, CONTENT_PER_PAGE)

        res.status(200).json({ "allContentSize": data.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

GetNewsRouter.get("/:date/sortBy/:param/:page", function (req: Request, res: Response) {

    try {
        const param = req.params.param as keyof new_object
        const page = parseInt(req.params.page)
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });
        if (!(param in jsonData.data.data[0])) return res.status(400).json({ "msg": `${param} key not valid!` });

        const data = (date == "current") ?
            jsonData.data :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;
        const sortData = sortBy(data, param);
        const dataToBeSent = sliceData(sortData, page, CONTENT_PER_PAGE);

        return res.status(200).json({ "allContentSize": data.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

GetNewsRouter.get("/:date/filterBy/:param/:value/:page", function (req: Request, res: Response) {

    try {

        const param = req.params.param as keyof new_object
        const value = req.params.value
        const page = parseInt(req.params.page)
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });
        if (!(param in jsonData.data.data[0])) return res.status(400).json({ "msg": `${param} key not valid!` });

        const data = (date == "current") ?
            jsonData.data :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const filteredData = filterBy(data, param, value);
        const dataToBeSent = sliceData(filteredData, page, CONTENT_PER_PAGE);
        return res.status(200).json({ "allContentSize": filteredData.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

GetNewsRouter.get("/:date/sortFilterBy/:sortParam/:filterParam/:filterValue/:page", function (req: Request, res: Response) {

    try {

        const sortParam = req.params.sortParam as keyof new_object
        const filterParam = req.params.filterParam as keyof new_object
        const filterValue = req.params.filterValue
        const page = parseInt(req.params.page)
        const date = req.params.date

        if (date !== "current" && !isValidDateFormat(date)) return res.status(400).json({ "msg": "Not a valid date" });
        if (isNaN(page) || page <= 0) return res.status(400).json({ "msg": `Invalid page number ${page}` });
        if (!(filterParam in jsonData.data.data[0]) || !(sortParam in jsonData.data.data[0])) return res.status(400).json({ "msg": `SORT_PARAm:${sortParam} or FILTER_PARAM:${filterParam} key not valid!` });

        const data = (date == "current") ?
            jsonData.data :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const filteredData = filterBy(data, filterParam, filterValue);
        const sortData = sortBy(filteredData, sortParam);
        const dataToBeSent = sliceData(sortData, page, CONTENT_PER_PAGE);

        return res.status(200).json({ "allContentSize": filteredData.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

GetNewsRouter.get("/:date/getNew/:id", (req: Request, res: Response) => {

    const id = req.params.id
    const date = req.params.date
    console.log(`trying to retrieve new with id ${id}`)

    try {

        if (date !== "current" && !isValidDateFormat(date)) {
            return res.status(400).json({ "msg": "Not a valid date" })
        }

        const data = (date == "current") ?
            jsonData.data :
            new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const newData = getSingleNewData(data, id)
        return res.status(200).json(newData)

    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": e })
    }
})

export default GetNewsRouter;