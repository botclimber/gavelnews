// allow giving feedback only for current date, however previous days can be checked but not changed/manipuldated only for read purposes

// load to memory current day only
// previous days are load on request and sent

import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import path from "path";

import GetNewsRouter from './routes/get/news/GetNewsRoutes';
import GetChatRouter from './routes/get/chat/GetChatRoutes';
import PostNewsRouter from './routes/post/news/PostNewsRoutes';
import PatchNewsRouter from './routes/patch/news/PatchNewsRoutes';
import loggingMiddleware from './middleware/recognizerMiddleware';

import { setupScheduler } from './cron/cronJob';

const viewsPath = "../../../../../views/lowLatencyMode/"

const app = express();
const PORT = 80;

app.use(cors());

app.use(bodyParser.json());

app.use(loggingMiddleware);

app.get("/", function (req: Request, res: Response) {

    app.use(express.static(path.join(__dirname, viewsPath)));

    res.sendFile(path.join(__dirname, viewsPath))
})

app.use("/news", GetNewsRouter);
app.use("/news", PostNewsRouter);
app.use("/news", PatchNewsRouter);
app.use("/chat", GetChatRouter);

// start scheduler
setupScheduler();

// Start the server
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});
