import { Request, Response, NextFunction } from 'express';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    console.log(`Request from IP: ${ip}`);
    console.log(`Request Endpoint: ${req.path}`);
    next();
};

export default loggingMiddleware;