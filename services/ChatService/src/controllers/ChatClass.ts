import * as WebSocket from 'ws';

// Define a class for the chat service
export class ChatClass {
    private wss: WebSocket.Server;
    private messagesMemory: Map<WebSocket, string[]>
  
    constructor(port: number) {
      this.wss = new WebSocket.Server({ port });
      this.messagesMemory = new Map();
      this.setupWebSocket();
    }
  
    // Setup WebSocket connection and event handlers
    private setupWebSocket() {
      this.wss.on('connection', (ws: WebSocket, req) => {
        console.log(`Client connected: ${this.wss.clients.size}`);

        this.messagesMemory.set(ws, [])
  
        // Event handler for receiving messages
        ws.on('message', (message: string) => {
          this.messagesMemory.get(ws)?.push(message)
          console.log('Received:', message);
          this.checkHowManyMessagesSent(ws)
          this.broadcast(message); // Broadcast the message to all clients
        });
  
        // Event handler for closing connection
        ws.on('close', () => {
          console.log('Client disconnected');
        });
      });
    }
  
    // Broadcast message to all connected clients
    private broadcast(message: Buffer | string) {
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {

            if(message instanceof Buffer){
              
              const msg = Buffer.from(message).toString('utf-8')
              client.send(msg)

            }else client.send(message);
        }
      });
    }

    // Check how many times the same user sent a message
    private checkHowManyMessagesSent(ws: WebSocket) {
      const messages = this.messagesMemory.get(ws)?.length
      console.log(`This user already sent: ${messages} messages`)
    }
  }