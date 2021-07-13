import Handler from "./handler/Handler";
import { Socket } from "socket.io";

export default class SocketHandlers {

    private readonly handler: Handler;
    private readonly socket: Socket;

    constructor(socket: Socket, handler: Handler) {
        this.handler = handler;
        this.socket = socket;
    }

    public run(): void {
        this.handler.handle(this.socket);
    }
}