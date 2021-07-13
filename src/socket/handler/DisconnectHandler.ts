import { Socket } from "socket.io";
import Handler from "./Handler";

export default class DisconnectHandler implements Handler {
    
    public handle(socket: Socket): void {
        throw new Error("Method not implemented.");
    }
}