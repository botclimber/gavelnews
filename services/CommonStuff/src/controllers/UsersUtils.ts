import { fullDateFormat, pathUsersData } from "../consts/consts";
import { loadFromFile, saveToFile} from "../functions/functions";
import { BlockActions, User, UserInfo, UserIdentifier } from "../types/types";
import * as dateAndTime from 'date-and-time';
import fs from 'fs';

class UsersUtils {
    
    private path: string = `${pathUsersData}allUsers.json`;
    private users: User[];

    getUsers (): User[] {
        return this.users
    }

    setUsers(): void{
        this.users = this.loadUsers()
    }

    loadUsers(): User[] {
        try {
            const dataFromFile = JSON.parse(loadFromFile(this.path));

            return dataFromFile;
        } catch (error) {
            console.error("Error loading users:", error);
            return [];
        }
    }

    async saveUsers(): Promise<void> {
        try {
            await saveToFile(JSON.stringify(this.users), this.path)
    
        } catch (error) {
            console.error('Error saving users:', error);
            return; // Re-throw the error for the caller to handle
        }
    }

    async registUser(userIdentifier: UserIdentifier, userInfo?: UserInfo): Promise<void> {

        try {

            // Check if the user exists in the file
            const userExists = await this.getUserIndex(userIdentifier, userInfo);

            if (userExists === undefined) {
                const username = { "": "" }

                const newUser: User = {
                    userInfo: userInfo,
                    userIdentifier: userIdentifier,
                    usernameId: username,
                    votes: { true: 0, false: 0, unclear: 0, noopinion: 0 },
                    chatMessages: 0,
                    createdAt: dateAndTime.format(new Date(), fullDateFormat),
                    block: { status: false, time: '' }
                };

                this.users.push(newUser);

            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    async blockUser(userIdentifier: UserIdentifier, action: BlockActions, time: string | undefined, userInfo?: UserInfo): Promise<User | void> {
        try {

            // Find the user with the given identifier
            const userIndex = await this.getUserIndex(userIdentifier, userInfo)
            if (userIndex === undefined) {
                console.log('User not found');
                return 
            }

            // Update block status and time
            this.users[userIndex].block.status = action === 'remove' ? false : true;
            this.users[userIndex].block.time = action === 'temporary' && time ? time : undefined;

            return this.users[userIndex];

        } catch (error) {
            console.error("Error blocking user:", error);
            return 
        }
    }

    async checkRemoveExpiredBlock(userIdentifier: UserIdentifier, userInfo?: UserInfo): Promise<User | undefined> {
        try {

            // Find the user in the list
            const userIndex = await this.getUserIndex(userIdentifier, userInfo)
            if (userIndex === undefined) return undefined;

            // Get current time
            const currentTime = new Date();
            const userTime = this.users[userIndex].block.time;

            // Check block status and time
            if (this.users[userIndex].block.status && userTime) {
                const blockTime = dateAndTime.parse(userTime, fullDateFormat)

                if (blockTime <= currentTime) {
                    this.users[userIndex].block.status = false;
                    this.users[userIndex].block.time = '';
                }
            }

            return this.users[userIndex]
        } catch (error) {
            console.error("Error removing expired blocks:", error);
            return undefined;
        }
    }

    async getUserIndex(userIdentifier?: UserIdentifier, userInfo?: UserInfo): Promise<number | undefined> {
        try {

            if(!(this.users.length > 0)) return undefined

            if (userInfo && userInfo.email) {
                const userInfoEmailIndex = this.users.findIndex(user => user.userInfo?.email === userInfo.email );

                if (userInfoEmailIndex !== -1) {
                    return userInfoEmailIndex;
                
                }else return undefined;
            }

            // If userInfo is not provided or userInfo.email is undefined, combine userIdentifier.ip and userIdentifier.userAgent
            if (userIdentifier) {
                const combinedIdentifier = userIdentifier.ip + userIdentifier.userAgent;
                const combinedIndex = this.users.findIndex(user => {

                    // && !user.userInfo cause otherwise this would be written in the existing non anon row
                    const userCombinedIdentifier = (user.userIdentifier && !user.userInfo)? user.userIdentifier.ip + user.userIdentifier.userAgent : "";

                    return userCombinedIdentifier === combinedIdentifier;
                });

                return combinedIndex !== -1 ? combinedIndex : undefined;
            }

            return undefined
        } catch (error) {
            console.error("Error getting user index by UserInfo:", error);
            return;
        }
    }


    async incrementVote(vote: keyof User["votes"], userInfo: UserInfo): Promise<void> {
        try {

            // Find the user in the list
            const userIndex = await this.getUserIndex(undefined, userInfo);
            if (userIndex === undefined) {
                console.log('User not found');
                return
            }

            // Increment the specified vote
            if (this.users[userIndex].votes[vote] !== undefined) {
                this.users[userIndex].votes[vote]++;
            } else {
                console.log('Invalid vote type');
                return;
            }

        } catch (error) {
            console.error("Error incrementing vote:", error);
            return;
        }
    }

    async decrementVote(vote: keyof User["votes"], userInfo: UserInfo): Promise<void> {
        try {

            // Find the user in the list
            const userIndex = await this.getUserIndex(undefined, userInfo);
            if (userIndex === undefined) {
                console.log('User not found');
                return
            }

            // Increment the specified vote
            if (this.users[userIndex].votes[vote] !== undefined) {
                this.users[userIndex].votes[vote]--;
            } else {
                console.log('Invalid vote type');
                return;
            }

        } catch (error) {
            console.error("Error incrementing vote:", error);
            return;
        }
    }

    async incrementChatMessage(userIdentifier: UserIdentifier, userInfo?: UserInfo): Promise<void> {
        try {

            // Find the user in the list
            const userIndex = await this.getUserIndex(userIdentifier, userInfo);

            if (userIndex === undefined) {
                console.log('User not found');
                return;
            }

            // Increment chatMessages
            this.users[userIndex].chatMessages++;

        } catch (error) {
            console.error("Error incrementing chat message:", error);
            return
        }
    }
}

export const allUsers = new UsersUtils();