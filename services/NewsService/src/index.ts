// allow giving feedback only for current date, however previous days can be checked but not changed/manipuldated only for read purposes

// load to memory current day only
// previous days are load on request and sent

import express, { NextFunction, Request, Response } from 'express';
import * as dateAndTime from "date-and-time";
import cors from "cors";
import * as schedule from "node-schedule";

import { NewsManipulator } from './controllers/NewsManipulator';
import { sortBy, filterBy, slicedData } from './controllers/NewsHelper';

import { fromRequestJsonFileFormat, opinion } from "../../CommonStuff/src/types/types"
import { dateFormat, Week, pathBackupData, pathMainData } from "../../CommonStuff/src/consts/consts"
import { getPreviousDate, saveToFile, loadFromFile, formatDate } from "../../CommonStuff/src/functions/functions"
import path from "path";
import { ChatClass } from './controllers/ChatHandler';

const viewPath = "../../../../../views/white_version/"

const app = express();
const PORT = 80;

app.use(cors());

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

    app.use(express.static(path.join(__dirname, viewPath)));

    res.sendFile(path.join(__dirname, viewPath))
})

app.get("/news", function (req: Request, res: Response) {

    res.status(200).json({"allContentSize": contentSize, "contentSize": jsonData.data.length, "content": jsonData.data})
})

app.get("/news/:page", function (req: Request, res: Response) {

    try{
        const page = req.params.page

        if (isNaN(page) || page <= 0) throw new Error(`Invalid page number ${page}`)
        
        const dataToBeSent: fromRequestJsonFileFormat = slicedData(jsonData.data, page, CONTENT_PER_PAGE)
    
        res.status(200).json({"allContentSize": contentSize, "contentSize": dataToBeSent.length, "content": dataToBeSent})
        
    }catch(e){ console.log(e) return res.status(500).json({"msg":e})}
})

app.get("/news/:action/:param/:page", function (req: Request, res: Response) {

    try{
        const action = req.params.action
        const param = req.params.param
        const page = parseInt(req.params.page)

        if (isNaN(page) || page <= 0) throw new Error(`Invalid page number ${page}`)
        if( !(param in jsonData.data[0])) throw new Error(`${param} key not valid!`);

        switch(action){
            case "filterBy":
                const sortData = sortBy(jsonData.data, param);
                const dataToBeSent = slicedData(sortData, page, CONTENT_PER_PAGE);
                return res.status(200).json({"allContentSize": contentSize, "contentSize": dataToBeSent.length, "content": dataToBeSent})
                    ; break;
            case "sortBy":
                const filteredData = filterBy(jsonData.data, param);
                const dataToBeSent = slicedData(filteredData, page, CONTENT_PER_PAGE);
                return res.status(200).json({"allContentSize": contentSize, "contentSize": dataToBeSent.length, "content": dataToBeSent})
                    ; break;
            default: throw new Error(`Invalid action ${action}`) ;
        }
        
    }catch(e){ console.log(e) return res.status(500).json({"msg":e})}
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

app.get("/old/:date", (req: Request, res: Response) => {

    const date = req.params.date

    if (date) {

        try {
            const oldJsonData = new NewsManipulator(loadData(`../Data/backup/${date}/`, new Date(date)))
            res.status(200).json(oldJsonData.data);

        } catch (e) {
            console.log(e)
            res.status(500).json({ "msg": `Error: (Most likely) No data found for the specified date` })
        }
    } else {
        res.status(400).json({ "msg": "date must be included in the request params!" })
    }
})

app.get("/old/chats/:date/:chatId", async (req: Request, res: Response) => {

    const chatCode = req.params.chatId
    const date = req.params.date

    try {
        const handler = new ChatClass(chatCode, date)

        if (chatCode === "*") {

            const chatsStatus = await handler.getChatsStatus()
            return res.status(200).json({"chatsStatus": chatsStatus})

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

console.log(ruleForSaveLoadData.hour)

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
        jsonData.sortByTitle()
        jsonData.cleanData()
        contentSize = jsonData.length
        console.log(`Loading recent Data into memory, with the size of ${jsonData.dataSize().toFixed(2)} `)

    } catch (error) {
        console.log(`An error ocurred while LOADING: ${error}`)
    }
});

// Read JSON data from file | TODO: put this to a cron job or check if 
jsonData = new NewsManipulator(loadData(pathMainData, getPreviousDate(1)))
jsonData.sortByTitle()
jsonData.cleanData()
contentSize = jsonData.length

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Memory need from loading JSON data is ${jsonData.dataSize().toFixed(2)}Mb`);
});
