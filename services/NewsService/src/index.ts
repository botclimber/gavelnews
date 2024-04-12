
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import path from "path";

import PutAdminRouter from './routes/put/admin/PutAdminRoutes';
import GetAdminRouter from './routes/get/admin/GetAdminRoutes';
import GetNewsRouter from './routes/get/news/GetNewsRoutes';
import GetChatRouter from './routes/get/chat/GetChatRoutes';
import PostNewsRouter from './routes/post/news/PostNewsRoutes';
import PatchNewsRouter from './routes/patch/news/PatchNewsRoutes';
import loggingMiddleware from './middleware/recognizerMiddleware';
import { checkHeader } from './middleware/AdminMiddleware';
import { allUsers } from '../../CommonStuff/src/controllers/UsersUtils';
import { changeDay, persistNewsData, persistSensitiveData, persistUsersData } from './cron/cronJob';
import { ChatClass } from './controllers/Chat/ChatClass';

const viewsPath = "../../../../../views/lowLatencyMode/"

const app = express();
const PORT = 80;
const CHAT_PORT = 8002;

// Configure CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, viewsPath)));

// Routes
app.get("/", async function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, viewsPath, "index.html"));
});

app.use("/news", loggingMiddleware, GetNewsRouter);
app.use("/news", loggingMiddleware, PostNewsRouter);
app.use("/news", loggingMiddleware, PatchNewsRouter);
app.use("/chat", loggingMiddleware, GetChatRouter);

// Apply authorization check middleware for admin routes
app.use("/admin", checkHeader, GetAdminRouter);
app.use("/admin", checkHeader, PutAdminRouter);

// setup chat service
const chatService = new ChatClass(CHAT_PORT);

// Initialize users
allUsers.setUsers();

// Start schedulers
persistSensitiveData();
changeDay(chatService);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
