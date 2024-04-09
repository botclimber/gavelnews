import { Request, Response, NextFunction } from 'express';

// Middleware function to check if a key or token is present in the request headers and compare it with an environment variable
export const checkHeader = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key']; // Change 'x-api-key' to the header key you want to check
    const envApiKey = process.env.SECRET; // Assuming API_KEY is the name of your environment variable

    if (!apiKey || (apiKey !== envApiKey)) {
        return res.status(401).send('Unauthorized: API key is invalid');
    }
    
    next();
};