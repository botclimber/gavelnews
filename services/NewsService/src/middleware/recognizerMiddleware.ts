import { Request, Response, NextFunction } from 'express';
import { allUsers } from '../../../CommonStuff/src/controllers/UsersUtils';
import { GoogleAuth } from '../../../CommonStuff/src/controllers/GoogleAuthUtils';

const googleAuth = new GoogleAuth()

const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const checkHeaderAuthForToken = (headerAuth?: string) => {
            if (headerAuth) return headerAuth.trim()
            else undefined
        }

        const userIdentifier = { ip: req.ip ?? "", userAgent: req.headers['user-agent'] ?? "" };
        const token = checkHeaderAuthForToken(req.headers['authorization'] || undefined);
        const userInfo = (token) ? await googleAuth.checkGoogleToken(token) : undefined;

        req.userIdentifier = userIdentifier;
        req.userInfo = userInfo;
        next();

    } catch (e) {
        console.log(e)
    }

};

export default loggingMiddleware;
