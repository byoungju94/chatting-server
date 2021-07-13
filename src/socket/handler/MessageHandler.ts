import { Socket } from "socket.io";
import MessageRepository from "../../../build/domain/message/MessageRepository";
import MessageDTO from "../../domain/message/dto/MessageDTO";
import Handler from "./Handler";

export default class MessageHandler implements Handler<MessageRepository> {
    
    public handle(socket: Socket, repository: MessageRepository, msg: any): void {
        const messageDTO = msg as MessageDTO;
        repository.create(messageDTO);
        socket.emit("message", messageDTO);
    }
}
