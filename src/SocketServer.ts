import 'reflect-metadata'
import http from "http";
import * as io from "socket.io";
import DataSourceConfiguration from "./configuration/StorageConfiguration"
import SocketHandlers from "./socket/SocketHandlers";
import { SocketEventHandlerTypes } from './socket/SocketEventHandlerTypes';

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
        const sequelize = await DataSourceConfiguration.change("mysql", "test");
        
        for (const eventType in SocketEventHandlerTypes) {
            const eventName = eventType.replace("Handler", "").toLowerCase();
            const handlers = new SocketHandlers(new SocketEventHandlerTypes[eventType](sequelize));
            socket.on(eventName, handlers.run.bind(handlers, socket));
        }
    }

    public get(): io.Server {
        return this.io;
    }

    public terminate(): void {
        return this.io.close();
    }
}
