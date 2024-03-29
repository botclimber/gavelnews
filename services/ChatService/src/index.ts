import {ChatClass} from './classes/ChatClass';

const PORT = 8080;
const chatService = new ChatClass(PORT);

console.log(`WebSocket server running on port ${PORT}`);