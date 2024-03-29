import {ChatClass} from './controllers/ChatClass';

const PORT = 8001;
const chatService = new ChatClass(PORT);

console.log(`WebSocket server running on port ${PORT}`);