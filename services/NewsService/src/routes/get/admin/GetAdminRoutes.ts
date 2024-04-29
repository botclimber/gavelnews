import express, { Request, Response } from 'express';
import { allUsers } from '../../../../../CommonStuff/src/controllers/UsersUtils';
import { User } from '../../../../../CommonStuff/src/types/types';
import { jsonData } from '../../../utils/JsonDataHandler';

// Endpoint to get all users
const GetAdminRouter = express.Router();

GetAdminRouter.get('/getUsers', async (req, res) => {
    
    try {
        // Get all users
        const users: User[] = allUsers.getUsers()

        // Send the users as JSON response
        res.status(200).json(users);
    
    } catch (error) {
        // Handle errors
        res.status(500).send('Internal Server Error');
        console.error('Error getting all users:', error);
    }
});

GetAdminRouter.get('/getNews', async (req, res) => {
    
    try {

        // Send the users as JSON response
        res.status(200).json({contentSize: jsonData.data.data.length, content: jsonData.data});
    
    } catch (error) {
        // Handle errors
        res.status(500).send('Internal Server Error');
        console.error('Error getting all News:', error);
    }
});

export default GetAdminRouter;