import {ChatClass} from './controllers/ChatClass';

// TODO:
// - save in memory last 50 or 100 messages
// - prevent/filter suspicious messages with links or script/html injection
// - prevent spam
// - [IDEA] create a chat for each New

const PORT = 8001;
const chatService = new ChatClass(PORT);

console.log(`WebSocket server running on port ${PORT}`);