// allow giving feedback only for current date, however previous days can be checked but not changed/manipuldated only for read purposes

// load to memory current day only
// previous days are load on request and sent

import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import * as dateAndTime from "date-and-time";
import cors from "cors";

import { NewsManipulator } from './controllers/NewsManipulator';

import {new_object, fromRequestJsonFileFormat, fromScrapyJsonFileFormat, opinion} from "../../CommonStuff/src/types/types"
import {dateFormat} from "../../CommonStuff/src/consts/consts"
import {getYesterdayDate} from "../../CommonStuff/src/functions/functions"

const app = express();
const PORT = 3000;

app.use(cors())

var jsonData: NewsManipulator

function loadData(): fromRequestJsonFileFormat {

    const yesterdayDate = getYesterdayDate()
    const filePath = `../Data/allData_${dateAndTime.format(yesterdayDate, dateFormat)}.json`
    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

// Read JSON data from file | TODO: put this to a cron job or check if 
jsonData = new NewsManipulator(loadData())

// Define API endpoints

// Middleware to log IP address
app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    console.log(`Request from IP: ${ip}`);
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
    .then( response => {

        if(response !== undefined) res.status(200).json({"new_data": response, "allData": jsonData});
        else res.status(401).json({"msg": "new not found in our db."})
    })
    .catch( e => {console.log(e); res.status(400).json({"msg": e.message}) })
})

/*app.get("/old/:date", (req: Request, res: Response) => {
    
    res.status(200).json({"msg": "something old"})
})*/

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});