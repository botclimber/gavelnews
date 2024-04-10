import { fullDateFormat, pathUsersData } from "../consts/consts";
import { loadFromFile, transform } from "../functions/functions";
import { BlockActions, User, UserInfo, UserIdentifier } from "../types/types";
import * as dateAndTime from 'date-and-time';
import fs from 'fs';

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
            const dataToWrite = users.map(user => JSON.stringify(user)).join('\n'); // Convert users to JSON strings and join them with newlines

            // Write data to the file, creating or erasing existing content and then appending
            await fs.promises.writeFile(this.path, dataToWrite, { flag: 'w+' }); // 'w+' flag opens the file for reading and writing, creating or truncating it

            console.log('Users saved successfully');
        } catch (error) {
            console.error('Error saving users:', error);
            throw error; // Re-throw the error for the caller to handle
        }
    }

    async registUser(userIdentifier: UserIdentifier, username: User["username"], userInfo?: UserInfo): Promise<void> {
        try {
            let users = await this.loadUsers();
            console.log(users)
            // Check if the user exists in the file
            const userExists = await this.getUserIndex(users, userIdentifier, userInfo);

            if (userExists === undefined) {
                const newUser: User = {
                    userInfo: userInfo,
                    userIdentifier: userIdentifier,
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

    async blockUser(userIdentifier: UserIdentifier, action: BlockActions, time: string | undefined, userInfo?: UserInfo): Promise<User> {
        try {
            // Load users from file
            let users = await this.loadUsers();

            // Find the user with the given identifier
            const userIndex = await this.getUserIndex(users, userIdentifier, userInfo)
            if (userIndex === undefined) {
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

    async checkRemoveExpiredBlock(userIdentifier: UserIdentifier, userInfo?: UserInfo): Promise<User | undefined> {
        try {
            let users = await this.loadUsers();

            // Find the user in the list
            const userIndex = await this.getUserIndex(users, userIdentifier, userInfo)
            if (userIndex === undefined) return undefined;

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

    async getUserIndex(users: User[], userIdentifier?: UserIdentifier, userInfo?: UserInfo): Promise<number | undefined> {
    try {
        // Prioritize search by userInfo.email if userInfo is provided
        if (userInfo && userInfo.email) {
            const userInfoEmailIndex = users.findIndex(user => user.userInfo?.email === userInfo.email);
            if (userInfoEmailIndex !== -1) {
                return userInfoEmailIndex;
            }
        }

        // If userInfo is not provided or userInfo.email is undefined, combine userIdentifier.ip and userIdentifier.userAgent
        if(userIdentifier){
        const combinedIdentifier = userIdentifier.ip + userIdentifier.userAgent;
        const combinedIndex = users.findIndex(user => {
            const userCombinedIdentifier = user.userIdentifier.ip + user.userIdentifier.userAgent;
            return userCombinedIdentifier === combinedIdentifier;
        });

        return combinedIndex !== -1 ? combinedIndex : undefined;
        }

        return undefined
    } catch (error) {
        console.error("Error getting user index by UserInfo:", error);
        throw error;
    }
}


    async incrementVote(vote: keyof User["votes"], userInfo: UserInfo): Promise<void> {
        try {
            let users = await this.loadUsers();

            // Find the user in the list
            const userIndex = await this.getUserIndex(users, userIdentifier, userInfo);
            if (userIndex === undefined) {
                throw new Error('User not found');
            }

            // Increment the specified vote
            if (users[userIndex].votes[vote] !== undefined) {
                users[userIndex].votes[vote]++;
            } else {
                throw new Error('Invalid vote type');
            }

            // Save the updated users list
            await this.saveUsers(users);
        } catch (error) {
            console.error("Error incrementing vote:", error);
            throw error;
        }
    }

    async incrementChatMessage(userIdentifier: UserIdentifier, userInfo?: UserInfo): Promise<void> {
        try {
            let users = await this.loadUsers();

            // Find the user in the list
            const userIndex = await this.getUserIndex(users, userIdentifier, userInfo);
            if (userIndex === undefined) {
                throw new Error('User not found');
            }

            // Increment chatMessages
            users[userIndex].chatMessages++;

            // Save the updated users list
            await this.saveUsers(users);
        } catch (error) {
            console.error("Error incrementing chat message:", error);
            throw error;
        }
    }
}

