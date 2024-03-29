import * as WebSocket from 'ws';

// Define a class for the chat service
export class ChatClass {
    private wss: WebSocket.Server;
  
    constructor(port: number) {
      this.wss = new WebSocket.Server({ port });
      this.setupWebSocket();
    }
  
    // Setup WebSocket connection and event handlers
    private setupWebSocket() {
      this.wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');
  
        // Event handler for receiving messages
        ws.on('message', (message: string) => {
          console.log('Received:', message);
          this.broadcast(message); // Broadcast the message to all clients
        });
  
        // Event handler for closing connection
        ws.on('close', () => {
          console.log('Client disconnected');
        });
      });
    }
  
    // Broadcast message to all connected clients
    private broadcast(message: string) {
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }