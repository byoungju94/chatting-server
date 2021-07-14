import 'reflect-metadata'
import http from "http";
import * as io from "socket.io";
import StorageConfiguration from "./configuration/StorageConfiguration"
import SocketHandlers from "./socket/SocketHandlers";
import { SocketEventTypes } from './socket/SocketEventType';

export default class SocketServer {

    private readonly io: io.Server;
 
    constructor(httpServer: http.Server) {
        this.io = new io.Server();
        this.io.attach(httpServer);
    
        this.initialize(this);
    }

    private initialize(socketServer: SocketServer): void {
        const tenant = socketServer.io.of(/^\/\w+$/);
        tenant.on('connection', async (socket: io.Socket) => {
            await SocketServer.registerEventHandler(socket, "test");
        });
    }

    public static async registerEventHandler(socket: io.Socket, tenant: string) {
        const sequelize = await StorageConfiguration.initialize("mysql", "test");
        
        for (const eventType in SocketEventTypes) {
            const eventName = eventType.replace("Handler", "").toLowerCase();
            const handlers = new SocketHandlers(new SocketEventTypes[eventType](sequelize));
            socket.on(eventName, handlers.run.bind(handlers));
        }
    }

    public get(): io.Server {
        return this.io;
    }

    public terminate(): void {
        return this.io.close();
    }
}
