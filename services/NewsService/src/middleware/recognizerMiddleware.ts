import { Request, Response, NextFunction } from 'express';
import { UsersUtils } from '../../../CommonStuff/src/controllers/UsersUtils';
import { GoogleAuth  } from '../../../CommonStuff/src/controllers/GoogleAuthUtils';

const userUtils = new UsersUtils()
const googleAuth = new GoogleAuth()

const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const checkHeaderAuthForToken = (headerAuth: string) => {
        if(headerAuth) return headerAuth.trim()
        else undefined
    }
    
    const userIdentifier = {ip: req.ip ?? "", userAgent: req.headers['user-agent'] ?? ""};
    const token = checkHeaderAuthForToken(req.headers['authorization']);
    const userInfo = (token)? await googleAuth.checkGoogleToken(token) : undefined;
    
    console.log(`Request from IP: ${userIdentifier.ip}`);
    console.log(`Request from UserAgent: ${userIdentifier.userAgent}`);
    console.log(`Request Endpoint: ${req.path}`);

    try {
        const userBlocked = await userUtils.checkRemoveExpiredBlock(userIdentifier, userInfo)

        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });
        else{

            req.userIdentifier = userIdentifier;
            req.userInfo = userInfo;
            next();
        }

    } catch (e) {
        console.log(e)
    }

};

export default loggingMiddleware;
