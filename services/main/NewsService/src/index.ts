// allow giving feedback only for current date, however previous days can be checked but not changed/manipuldated only for read purposes

// load to memory current day only
// previous days are load on request and sent

import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import * as dateAndTime from "date-and-time";
import cors from "cors";
import * as schedule from "node-schedule";

import { NewsManipulator } from './controllers/NewsManipulator';

import { new_object, fromRequestJsonFileFormat, fromScrapyJsonFileFormat, opinion } from "../../CommonStuff/src/types/types"
import { dateFormat, Week } from "../../CommonStuff/src/consts/consts"
import { getYesterdayDate } from "../../CommonStuff/src/functions/functions"

const app = express();
const PORT = 3000;

app.use(cors());

var jsonData: NewsManipulator

function loadData(path: string, date: Date): fromRequestJsonFileFormat {

    const filePath = `${path}allData_${dateAndTime.format(date, dateFormat)}.json`
    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

// Define API endpoints

// Middleware to log IP address
app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    console.log(`Request from IP: ${ip}`);
    console.log(`Request Endpoint: ${req.path}`)
    next(); // Pass the request to the next middleware or route handler
});

app.get("/", (req: Request, res: Response) => {

    res.status(200).json(jsonData.data)
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
            res.status(200).json(oldJsonData.data)

        } catch (e) {
            res.status(500).json({ "msg": `Error: (Most likely) No data found for the specified date`})
        }
    } else {
        res.status(400).json({ "msg": "date must be included in the request params!" })
    }
})


/**
 * CRON JOB
 */
const ruleForSaveData = new schedule.RecurrenceRule();
const ruleForLoadData = new schedule.RecurrenceRule();

ruleForSaveData.dayOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];
ruleForLoadData.dayOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

ruleForSaveData.hour = 14;
ruleForSaveData.minute = 20;

ruleForLoadData.hour = 14;
ruleForLoadData.minute = 20;

schedule.scheduleJob(ruleForSaveData, async function () {
  try {
    // save manipulated data to file

  } catch (error) {
    console.log(`An error ocurred: ${error}`)
  }
});

schedule.scheduleJob(ruleForLoadData, async function () {
    try {
      // load newly generated data 
  
    } catch (error) {
      console.log(`An error ocurred: ${error}`)
    }
  });

// Read JSON data from file | TODO: put this to a cron job or check if 
jsonData = new NewsManipulator(loadData("../Data/", getYesterdayDate()))
const memoryUsageByData = Buffer.byteLength(JSON.stringify(jsonData.data), 'utf8') / (1024 * 1024);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Memory need from loading JSON data is ${memoryUsageByData.toFixed(2)}Mb`);
});