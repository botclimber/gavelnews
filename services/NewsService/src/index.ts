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
import { getPreviousDate } from "../../CommonStuff/src/functions/functions"

const app = express();
const PORT = 3000;

const pathMainData = "../Data/"
const pathBackupData = "../Data/backup/"

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
const ruleForSaveLoadData = new schedule.RecurrenceRule();

const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

ruleForSaveLoadData.dayOfWeek = daysOfWeek;
ruleForSaveLoadData.hour = 10;
ruleForSaveLoadData.minute = 45;

schedule.scheduleJob(ruleForSaveLoadData, async function () {
  try {
    const twoDaysBefore = dateAndTime.format(getPreviousDate(2), dateFormat)

    // save manipulated data to file
    console.log("Saving data to file: Start ...")
    await fs.promises.writeFile(`${pathBackupData}/${twoDaysBefore}/allData_${twoDaysBefore}.json`, JSON.stringify(jsonData.data))
    console.log("Saving data to file: finish.")

    // load newly generated data 
    jsonData = new NewsManipulator(loadData(pathMainData, getPreviousDate(1)))
    jsonData.sortByTitle()
    console.log(`Loading recent Data into memory, with the size of ${jsonData.dataSize().toFixed(2)} `)

  } catch (error) {
    console.log(`An error ocurred: ${error}`)
  }
});

// Read JSON data from file | TODO: put this to a cron job or check if 
jsonData = new NewsManipulator(loadData(pathMainData, getPreviousDate(1)))
jsonData.sortByTitle()

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Memory need from loading JSON data is ${jsonData.dataSize().toFixed(2)}Mb`);
});