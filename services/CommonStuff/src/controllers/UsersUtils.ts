import { fullDateFormat, pathUsersData } from "../consts/consts";
import { loadFromFile, saveToFile, transform } from "../functions/functions";
import { BlockActions, User } from "../types/types";
import * as dateAndTime from 'date-and-time';

export class UsersUtils {
    private path: string = `${pathUsersData}allUsers.txt`;

    async loadUsers(): Promise<User[]> {
        try {
            const dataFromFile = await loadFromFile(this.path);
            const users = await transform<User>(dataFromFile);

            return users;
        } catch (error) {
            console.error("Error loading users:", error);
            return [];
        }
    }

    async saveUsers(users: User[]): Promise<void> {
        try {
            await saveToFile(JSON.stringify(users), this.path);
        } catch (error) {
            console.error("Error saving users:", error);
        }
    }

    async registUser(userIp: User["ip"], username: User["username"]): Promise<void> {
        try {
            let users = await this.loadUsers();

            // Check if the user exists in the file
            const userExists = await this.getUserIndexByIp(users, userIp);
            if (!userExists) {
                const newUser: User = {
                    ip: userIp,
                    username: username,
                    votes: { true: 0, false: 0, unclear: 0, noopinion: 0 },
                    chatMessages: 0,
                    createdAt: dateAndTime.format(new Date(), fullDateFormat),
                    block: { status: false, time: '' }
                };
                users.push(newUser);
                await this.saveUsers(users);
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    async blockUser(userIp: string, action: BlockActions, time: string | undefined): Promise<User> {
        try {
            // Load users from file
            let users = await this.loadUsers();

            // Find the user with the given IP
            const userIndex = await this.getUserIndexByIp(users, userIp)
            if (!userIndex) {
                throw new Error('User not found');
            }

            // Update block status and time
            users[userIndex].block.status = action === 'remove' ? false : true;
            users[userIndex].block.time = action === 'temporary' && time ? time : undefined;

            // Save the updated users list
            await this.saveUsers(users);

            return users[userIndex];

        } catch (error) {
            console.error("Error blocking user:", error);
            throw error; // Re-throwing the error for the caller to handle
        }
    }

    async checkRemoveExpiredBlocks(userIp: User["ip"]): Promise<User> {
        try {
            let users = await this.loadUsers();

            // Find the user in the list
            const userIndex = await this.getUserIndexByIp(users, userIp)
            if (!userIndex) {
                throw new Error('User not found');
            }

            // Get current time
            const currentTime = new Date();
            const userTime = users[userIndex].block.time;

            // Check block status and time
            if (users[userIndex].block.status && userTime) {
                const blockTime = dateAndTime.parse(userTime, fullDateFormat)

                if (blockTime <= currentTime) {
                    users[userIndex].block.status = false;
                    users[userIndex].block.time = '';
                }
            }

            // Save the updated users list
            await this.saveUsers(users);
            
            return users[userIndex]
        } catch (error) {
            console.error("Error removing expired blocks:", error);
            throw error
        }
    }

    async getUserIndexByIp(users: User[], ip: string): Promise<number | undefined> {
        try {
            const userIndex = users.findIndex(user => user.ip === ip);
            if (userIndex === -1) {
                return undefined; // Return undefined if user is not found
            }

            return userIndex;
        } catch (error) {
            console.error("Error getting user index by IP:", error);
            throw error;
        }
    }
}
