import { Request, Response, NextFunction } from 'express';
import { UsersUtils } from '../../../CommonStuff/src/controllers/UsersUtils';

const userUtils = new UsersUtils()

const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    console.log(`Request from IP: ${ip}`);
    console.log(`Request Endpoint: ${req.path}`);

    try {
        // TODO: regist connection using IP
        const userBlocked = await userUtils.checkRemoveExpiredBlock(ip ?? "")

        if (userBlocked !== undefined && userBlocked.block.status) return res.status(403).json({ msg: `Sry but you are blocked. timeout until ${userBlocked.block.time}` });
        else next();

    } catch (e) {
        console.log(e)
    }

};

export default loggingMiddleware;