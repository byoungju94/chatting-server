import { Socket } from "socket.io";

export default interface Handler<T> {
    
    handle(socket: Socket, repository: T, msg: any): void;
}