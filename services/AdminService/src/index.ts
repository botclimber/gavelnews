import express from 'express';
import { UsersUtils } from '../../CommonStuff/src/controllers/UsersUtils';
import { BlockActions, User } from '../../CommonStuff/src/types/types';
import { calculateFutureDate } from '../../CommonStuff/src/functions/functions';
import { checkHeader } from './Middleware/middleware';

const app = express();
const port = 8003;

const usersUtils = new UsersUtils();

app.use(checkHeader);

// Endpoint to get all users
app.get('/admin/getUsers', async (req, res) => {
    try {
        // Get all users
        const users: User[] = await usersUtils.loadUsers()

        // Send the users as JSON response
        res.status(200).json(users);
    
    } catch (error) {
        // Handle errors
        res.status(500).send('Internal Server Error');
        console.error('Error getting all users:', error);
    }
});

// Endpoint to block or remove block from user
app.put('/admin/block', async (req, res) => {
    const userIp: string = req.body.userIp; // Extract userId from request URL
    const action = req.body.action as BlockActions; // Assuming action is passed in the request body
    const timeToAdd: {"timeToAdd": number, "toAddType": "mins" | "hours" | "days"} | undefined = req.body.time

    try {
        // Block, unblock, or remove block from user
        const time = (timeToAdd)? calculateFutureDate(new Date(), timeToAdd.timeToAdd, timeToAdd.toAddType) : undefined
        const result: User = await usersUtils.blockUser(userIp, action, time);

        // Send the updated user information as JSON response
        res.status(200).json(result);
    } catch (error) {
        // Handle errors
        res.status(500).send('Internal Server Error');
        console.error('Error blocking/unblocking user:', error);
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});