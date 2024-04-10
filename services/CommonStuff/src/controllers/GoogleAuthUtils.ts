// npm install google-auth-library
import { OAuth2Client } from 'google-auth-library';
import { UserInfo } from "../types/types";

export class GoogleAuth {
    private clientId = process.env.CLIENT_ID || '';
    private clientSecret = process.env.CLIENT_SECRET || '';
    private client: OAuth2Client;

    constructor() {
        // Check if clientId and clientSecret are provided
        if (!this.clientId || !this.clientSecret) {
            throw new Error('Google client ID and client secret are required.');
        }

        // Create OAuth2 client instance
        this.client = new OAuth2Client(this.clientId, this.clientSecret);
    }

    async checkGoogleToken(token: string): Promise<UserInfo | undefined> {
        try {
            // Verify the token
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: this.clientId, // Use clientId here
            });

            // Get payload from the verified token
            const payload = ticket.getPayload();

            if (!payload) return undefined;

            // Extract user information from the payload
            const email = payload.email as string;
            const fullName = payload.name as string;
            const img = payload.picture as string;

            // Return userInfo object
            return { email, fullName, img };
          
        } catch (error) {
            console.error('Error verifying Google token:', error);
            return null;
        }
    }
}
