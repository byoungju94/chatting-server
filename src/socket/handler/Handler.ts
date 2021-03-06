import { Socket } from "socket.io";

export default interface Handler {
    
    handle(socket: Socket, msg: any): void;
}