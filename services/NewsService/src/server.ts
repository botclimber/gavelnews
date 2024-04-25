import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';

import PutAdminRouter from './routes/put/admin/PutAdminRoutes';
import GetAdminRouter from './routes/get/admin/GetAdminRoutes';
import GetNewsRouter from './routes/get/news/GetNewsRoutes';
import GetChatRouter from './routes/get/chat/GetChatRoutes';
import PostNewsRouter from './routes/post/news/PostNewsRoutes';
import PatchNewsRouter from './routes/patch/news/PatchNewsRoutes';
import loggingMiddleware from './middleware/recognizerMiddleware';
import { checkHeader } from './middleware/AdminMiddleware';

import { allUsers } from '../../CommonStuff/src/controllers/UsersUtils';
import { ServerConfig } from '../../CommonStuff/src/types/types';

import { changeDay, persistSensitiveData } from './cron/cronJob';
import { ChatClass } from './controllers/Chat/ChatClass';

const viewsPath = '../../../../../views/lowLatencyMode/';

export function createServer(config: ServerConfig): http.Server | https.Server {
  const app = express();

  // Configure CORS
  app.use(cors());

  // Parse JSON bodies
  app.use(bodyParser.json());

  // Serve static files
  app.use(express.static(path.join(__dirname, viewsPath)));

  // Routes
  app.get('/', async function (req, res) {
    res.sendFile(path.join(__dirname, viewsPath, 'index.html'));
  });

  app.use('/news', loggingMiddleware, GetNewsRouter);
  app.use('/news', loggingMiddleware, PostNewsRouter);
  app.use('/news', loggingMiddleware, PatchNewsRouter);
  app.use('/chat', loggingMiddleware, GetChatRouter);

  // Apply authorization check middleware for admin routes
  app.use('/admin', checkHeader, GetAdminRouter);
  app.use('/admin', checkHeader, PutAdminRouter);

  // setup chat service
  let server;
  if (config.useHTTPS) {

    const certPath = config.certPath || "";
    const keyPath = config.keyPath || "";

    const options = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };

    server = https.createServer(options, app);

    // Middleware to redirect HTTP to HTTPS
    app.use((req, res, next) => {
      // If the request is already secure (HTTPS), move to the next middleware
      if (req.secure) {
        return next();
      }
      // Redirect to HTTPS
      res.redirect('https://' + req.hostname + req.url);
    });

  } else {
    server = http.createServer(app);
  }

  // setup chat service
  const chatService = new ChatClass(server);

  // Initialize users
  allUsers.setUsers();

  // Start schedulers
  persistSensitiveData();
  changeDay(chatService);

  return server;
}
