import Handler from "./handler/Handler";
import { Socket } from "socket.io";

export default class SocketHandlers {

    private readonly handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
    }

    public run(socket: Socket, msg: any): void {
        this.handler.handle(socket, msg);
    }
}