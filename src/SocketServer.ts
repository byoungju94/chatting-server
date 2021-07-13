import http from "http";
import { Server, Socket } from "socket.io";
import SocketHandlers from "./socket/SocketHandlers";

export default class SocketServer {

    private readonly io: Server;
    private readonly eventTypes = ['connect', 'disconnect'];
 
    constructor(httpServer: http.Server) {
        this.io = new Server();
        this.io.attach(httpServer);
    
        this.addHandlers();
    }

    private addHandlers(): void {
        this.io.on('connection', (socket: Socket) => {
            for (const event in this.eventTypes) {
                const socketHandlers = new SocketHandlers(socket, new (<any>window)[event.charAt(0).toUpperCase() + event.slice(1) + "Handler"]());
                socket.on(event, socketHandlers.run.bind(socketHandlers));
            }
        });
    }
}
