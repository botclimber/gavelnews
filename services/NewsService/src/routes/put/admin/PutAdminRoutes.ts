import express from 'express';
import { allUsers } from '../../../../../CommonStuff/src/controllers/UsersUtils';
import { BlockActions, User, UserIdentifier, UserInfo } from '../../../../../CommonStuff/src/types/types';
import { calculateFutureDate } from '../../../../../CommonStuff/src/functions/functions';

const PutAdminRouter = express.Router();

PutAdminRouter.put('/block', express.json(), async (req, res) => {
    const userIdentifier: UserIdentifier = req.body.userIdentifier; // Extract userId from request URL
    const userInfo: UserInfo = req.body.userInfo || undefined;
    const action = req.body.action as BlockActions; // Assuming action is passed in the request body
    const timeToAdd: {"timeToAdd": number, "toAddType": "mins" | "hours" | "days"} | undefined = req.body.time;

    try {
        // Block, unblock, or remove block from user
        const time = (timeToAdd)? calculateFutureDate(new Date(), timeToAdd.timeToAdd, timeToAdd.toAddType) : undefined;
        const result: User | void = await allUsers.blockUser(userIdentifier, action, time, userInfo);

        // Send the updated user information as JSON response
        res.status(200).json(result);
    } catch (error) {
        // Handle errors
        res.status(500).send('Internal Server Error');
        console.error('Error blocking/unblocking user:', error);
    }
});

export default PutAdminRouter;
