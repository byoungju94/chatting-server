import { Socket } from "socket.io";

export default interface Handler<T> {
    
    handle(socket: Socket, msg: any): void;
}