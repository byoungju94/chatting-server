import http from "http";
import { Server, Socket } from "socket.io";
import StorageConfiguration from "../build/configuration/StorageConfiguration";
import SocketHandlers from "./socket/SocketHandlers";

export default class SocketServer {

    private readonly io: Server;
    private readonly eventTypes = ['connect', 'disconnect', 'message'];
 
    constructor(httpServer: http.Server) {
        this.io = new Server();
        this.io.attach(httpServer);
    
        this.addHandlers();
    }

    private addHandlers(): void {
        const tenant = this.io.of(/^\/\w+$/);

        tenant.use((socket: Socket, next) => {
            next();
        })

        tenant.on('connection', async (socket: Socket) => {
            const tenant = socket.nsp.name;
            const sequelize = await StorageConfiguration.initialize("mysql", tenant);

            for (const event in this.eventTypes) {
                const socketHandlers = new SocketHandlers(new (<any>window)[event.charAt(0).toUpperCase() + event.slice(1) + "Handler"](sequelize));

                socket.on(event, socketHandlers.run.bind(socketHandlers));
            }
        });
    }

    public get(): Server {
        return this.io;
    }
}
