import * as WebSocket from 'ws';

type chatCode = string

// Define a class for the chat service
export class ChatClass {
  private MESSAGES_LIMIT_PER_CHAT: number = 5
  private wss: WebSocket.Server;
  private messagesMemory: Map<chatCode, string[]>
  private chatClientsMap: Map<chatCode, WebSocket[]>

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.messagesMemory = new Map();
    this.chatClientsMap = new Map();
    this.setupWebSocket();
  }

  private connectClientToChat(ws: WebSocket, chatCode: chatCode): void {
    try {
      const checkIfChatAlreadySet = this.chatClientsMap.get(chatCode)

      if (checkIfChatAlreadySet == undefined) this.chatClientsMap.set(chatCode, [ws])
      else {
        if (!this.chatClientsMap.get(chatCode)?.includes(ws)){
          console.log("client is not included on this chat yet!")
          this.chatClientsMap.get(chatCode)?.push(ws);
        }
      }

    } catch (e) {
      console.log(this.connectClientToChat.toString)
      console.log(e)
    }
  }

  private addMessageToChat(message: string, chatCode: chatCode): void {
    // TODO: verify if 

    try {
      const checkIfMessageMemoryExists = this.messagesMemory.get(chatCode)

      if (checkIfMessageMemoryExists == undefined) this.messagesMemory.set(chatCode, [message])
      else this.messagesMemory.get(chatCode)?.push(message)

    } catch (e) {
      console.log(this.addMessageToChat.toString)
      console.log(e)
    }
  }

  // Setup WebSocket connection and event handlers
  private setupWebSocket() {

    try {
      this.wss.on('connection', (ws: WebSocket, req) => {
        console.log(`Client connected: ${this.wss.clients.size}`);
        console.log(this.chatClientsMap)

        // Extract chat code from URL
        const urlParts = req.url?.split('/');
        const chatCode = (urlParts && urlParts.length > 1 && urlParts[1] !== "") ? urlParts[1] : "/"; // Assuming "/" as default chat code if none specified

        console.log(`chatCode: ${chatCode}`)
        this.connectClientToChat(ws, chatCode)
        this.onConnection(ws, chatCode)

        // Event handler for receiving messages
        ws.on('message', (message: string) => {

          console.log('Received:', message);
          this.checkHowManyMessagesSent(chatCode)
          this.broadcast(message, chatCode); // Broadcast the message to all clients
        });

        // Event handler for closing connection
        ws.on('close', () => {

          /* Handle client chat connection by removing him */
          const index = this.chatClientsMap.get(chatCode)?.indexOf(ws)

          // remove client
          if (index !== undefined && index !== -1) this.chatClientsMap.get(chatCode)?.splice(index, 1)

          // if empty remove chat/room
          if(this.chatClientsMap.get(chatCode)?.length == 0) this.chatClientsMap.delete(chatCode);
          /* --- */

          console.log('Client disconnected');
          console.log(this.chatClientsMap)

        });
      });
    } catch (e) {
      console.log(this.setupWebSocket.toString)
      console.log(e)
    }

  }

  // Broadcast message to all connected clients
  private broadcast(message: Buffer | string, chatCode: string) {
    try {
      this.chatClientsMap.get(chatCode)?.map(client => {
        console.log("logged clients x.")
        const msg: string = (message instanceof Buffer)? this.parseToString(message) : message
        
        if (client.readyState === WebSocket.OPEN){
          this.addMessageToChat(msg, chatCode)
          client.send(msg);
        }
      })

    } catch (e) {
      console.log(this.broadcast.toString)
      console.log(e)
    }
  }

  // Check how many times the same user sent a message
  private checkHowManyMessagesSent(chatCode: string) {
    const messages = this.messagesMemory.get(chatCode)?.length
    console.log(`This Chat (${chatCode}) already has: ${messages} messages`)
  }

  private onConnection(ws: WebSocket, chatCode: chatCode){
    try{

      const messages: string[] = this.messagesMemory.get(chatCode) ?? []
      console.log(`sending messages to client:`)
      console.log(messages)
      ws.send(JSON.stringify(messages))

    }catch(e){
      console.log(this.onConnection.toString)
      console.log(e)
    }
  }

  private parseToString(message: Buffer): string{ return Buffer.from(message).toString('utf-8') }
}