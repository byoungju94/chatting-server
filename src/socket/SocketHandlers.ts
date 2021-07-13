import Handler from "./handler/Handler";
import { Socket } from "socket.io";

export default class SocketHandlers<T> {

    private readonly handler: Handler<T>;

    constructor(handler: Handler<T>) {
        this.handler = handler;
    }

    public run(socket: Socket, repository: T, msg: any): void {
        this.handler.handle(socket, repository, msg);
    }
}