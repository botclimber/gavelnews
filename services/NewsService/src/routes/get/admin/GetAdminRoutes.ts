import express, { Request, Response } from 'express';
import { allUsers } from '../../../../../CommonStuff/src/controllers/UsersUtils';
import { User } from '../../../../../CommonStuff/src/types/types';

// Endpoint to get all users
const GetAdminRouter = express.Router();

GetAdminRouter.get('/getUsers', async (req, res) => {
    
    try {
        // Get all users
        const users: User[] = allUsers.getUsers()

        console.log("USERS")
        console.log(users)

        // Send the users as JSON response
        res.status(200).json(users);
    
    } catch (error) {
        // Handle errors
        res.status(500).send('Internal Server Error');
        console.error('Error getting all users:', error);
    }
});

export default GetAdminRouter;