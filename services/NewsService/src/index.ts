// allow giving feedback only for current date, however previous days can be checked but not changed/manipuldated only for read purposes

// load to memory current day only
// previous days are load on request and sent

import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import * as schedule from "node-schedule";

import { NewsManipulator } from './controllers/NewsManipulator';
import { sortBy, filterBy, sliceData, getSingleNewData, search, isValidDateFormat } from './controllers/NewsHelper';

import { fromRequestJsonFileFormat, new_object, opinion } from "../../CommonStuff/src/types/types"
import { dateFormat, Week, pathBackupData, pathMainData } from "../../CommonStuff/src/consts/consts"
import { getPreviousDate, saveToFile, loadFromFile, formatDate } from "../../CommonStuff/src/functions/functions"
import path from "path";
import { ChatClass } from './controllers/ChatHandler';

const viewsPath = "../../../../../views/lowLatencyMode/"

const app = express();
const PORT = 80;

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

var jsonData: NewsManipulator
var contentSize: number

const CONTENT_PER_PAGE: number = 10

function loadData(path: string, date: Date): fromRequestJsonFileFormat {

    try {
        const filePath = `${path}allData_${formatDate(date, dateFormat)}.json`

        return JSON.parse(loadFromFile(filePath))

    } catch (e) {
        console.log(e)
        return { "data": [] }
    }
}

// Define API endpoints

// Middleware to log IP address
app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    console.log(`Request from IP: ${ip}`);
    console.log(`Request Endpoint: ${req.path}`)
    next(); // Pass the request to the next middleware or route handler
});

app.get("/", function (req: Request, res: Response) {

    app.use(express.static(path.join(__dirname, viewsPath)));

    res.sendFile(path.join(__dirname, viewsPath))
})

app.get("/news/:date", function (req: Request, res: Response) {

    try{
        const date = req.params.date

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});

        const dataToBeSent = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data


        res.status(200).json({ "allContentSize": dataToBeSent.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    }catch(e){ console.log(e); return res.status(500).json({ "msg": e }); }
    
})

app.get("/news/:date/:page", function (req: Request, res: Response) {

    try {
        const date = req.params.date
        const page = parseInt(req.params.page)

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});
        if (isNaN(page) || page <= 0) return res.status(400).json({"msg": `Invalid page number ${page}`});

        const data = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data
        const dataToBeSent: fromRequestJsonFileFormat = sliceData(data, page, CONTENT_PER_PAGE)

        res.status(200).json({ "allContentSize": data.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

app.get("/news/:date/sortBy/:param/:page", function (req: Request, res: Response) {

    try {
        const param = req.params.param as keyof new_object
        const page = parseInt(req.params.page)
        const date = req.params.date

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});
        if (isNaN(page) || page <= 0) return res.status(400).json({"msg": `Invalid page number ${page}`});
        if (!(param in jsonData.data.data[0])) return res.status(400).json({"msg": `${param} key not valid!`});

        const data = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;
        const sortData = sortBy(data, param);
        const dataToBeSent = sliceData(sortData, page, CONTENT_PER_PAGE);

        return res.status(200).json({ "allContentSize": data.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

app.get("/news/:date/filterBy/:param/:value/:page", function (req: Request, res: Response) {

    try {

        const param = req.params.param as keyof new_object
        const value = req.params.value
        const page = parseInt(req.params.page)
        const date = req.params.date

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});
        if (isNaN(page) || page <= 0) return res.status(400).json({"msg": `Invalid page number ${page}`});
        if (!(param in jsonData.data.data[0])) return res.status(400).json({"msg": `${param} key not valid!`});

        const data = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const filteredData = filterBy(data, param, value);
        const dataToBeSent = sliceData(filteredData, page, CONTENT_PER_PAGE);
        return res.status(200).json({ "allContentSize": filteredData.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

app.get("/news/:date/sortFilterBy/:sortParam/:filterParam/:filterValue/:page", function (req: Request, res: Response) {

    try {

        const sortParam = req.params.sortParam as keyof new_object
        const filterParam = req.params.filterParam as keyof new_object
        const filterValue = req.params.filterValue
        const page = parseInt(req.params.page)
        const date = req.params.date

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});
        if (isNaN(page) || page <= 0) return res.status(400).json({"msg": `Invalid page number ${page}`});
        if (!(filterParam in jsonData.data.data[0]) || !(sortParam in jsonData.data.data[0])) return res.status(400).json({"msg": `SORT_PARAm:${sortParam} or FILTER_PARAM:${filterParam} key not valid!`});

        const data = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const filteredData = filterBy(data, filterParam, filterValue);
        const sortData = sortBy(filteredData, sortParam);
        const dataToBeSent = sliceData(sortData, page, CONTENT_PER_PAGE);

        return res.status(200).json({ "allContentSize": filteredData.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) { console.log(e); return res.status(500).json({ "msg": e }); }
})

app.post("/news/:date/search/:page", (req: Request, res: Response) => {

    try {

        const title = req.body.title ?? ""
        const page = parseInt(req.params.page)
        const date = req.params.date

        if( date !==  "current" && !isValidDateFormat(date)) return res.status(400).json({"msg": "Not a valid date"});
        if (isNaN(page) || page <= 0) return res.status(400).json({"msg": `Invalid page number ${page}`});
        if(title === "") return res.status(400).json({"msg": "Invalid request, either no title param or empty!"});

        const data = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const matchedNews = search(data, title)
        const dataToBeSent = sliceData(matchedNews, page, CONTENT_PER_PAGE)
        return res.status(200).json({ "allContentSize": matchedNews.data.length, "contentSize": dataToBeSent.data.length, "content": dataToBeSent })

    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": e })
    }
})

app.get("/news/:date/getNew/:id", (req: Request, res: Response) => {

    const id = req.params.id
    const date = req.params.date
    console.log(`trying to retrieve new with id ${id}`)

    try {

        if( date !==  "current" && !isValidDateFormat(date)){
            return res.status(400).json({"msg": "Not a valid date"})
        } 

        const data = (date == "current")? 
        jsonData.data :
        new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date))).data;

        const newData = getSingleNewData(data, id)
        return res.status(200).json(newData)

    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": e })
    }
})

app.patch("/new/:newId/:opinion", (req: Request, res: Response) => {

    const ip = req.ip
    const newId = req.params.newId
    const opinion = req.params.opinion as opinion

    jsonData.updateNewVeracity(newId, opinion, ip)
        .then(response => {

            if (response !== undefined) res.status(200).json({ "new_data": response, "allData": jsonData });
            else res.status(401).json({ "msg": "new not found in our db." })
        })
        .catch(e => { console.log(e.message); res.status(400).json({ "msg": e.message }) })
})

app.get("/old/chats/:date/:chatId", async (req: Request, res: Response) => {

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

/**
 * CRON JOB
 */
const ruleForSaveLoadData = new schedule.RecurrenceRule();

const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

ruleForSaveLoadData.dayOfWeek = daysOfWeek;
ruleForSaveLoadData.hour = process.env.HOUR || 2;
ruleForSaveLoadData.minute = process.env.MIN || 30;

schedule.scheduleJob(ruleForSaveLoadData, async function () {
    try {
        const twoDaysBefore = formatDate(getPreviousDate(2), dateFormat)

        // save manipulated data to file
        console.log("Saving data to file: Start ...")

        if (jsonData.data.data.length > 0) await saveToFile(JSON.stringify(jsonData.data), `${pathBackupData}/${twoDaysBefore}/allData_${twoDaysBefore}.json`);

        else console.log("\tNothing to be saved!")

        console.log("Saving data to file: finish.")

    } catch (error) {
        console.log(`An error ocurred while SAVING: ${error}`)
    }

    try {
        // load newly generated data 
        jsonData = new NewsManipulator(loadData(pathMainData, getPreviousDate(1)))
        jsonData.sortByTitle() //TODO: sortBy existing description instead
        jsonData.cleanData()
        contentSize = jsonData.data.data.length
        console.log(`Loading recent Data into memory, with the size of ${jsonData.dataSize().toFixed(2)} `)

    } catch (error) {
        console.log(`An error ocurred while LOADING: ${error}`)
    }
});

// Read JSON data from file | TODO: put this to a cron job or check if 
jsonData = new NewsManipulator(loadData(pathMainData, getPreviousDate(1)))
jsonData.sortByTitle() //TODO: sortBy existing description instead
jsonData.cleanData()
contentSize = jsonData.data.data.length

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Memory need from loading JSON data is ${jsonData.dataSize().toFixed(2)}Mb`);
});
