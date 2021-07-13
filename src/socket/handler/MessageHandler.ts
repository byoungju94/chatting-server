import { Socket } from "socket.io";
import MessageRepository from "../../domain/message/MessageRepository";
import Handler from "./Handler";
import MessageSaveDTO from "../../domain/message/dto/MessageSaveDTO";

export default class MessageHandler implements Handler<MessageRepository> {

    private repository: MessageRepository;

    constructor(repository: MessageRepository) {
        this.repository = repository;
    }
    
    public handle(socket: Socket, msg: any): void {
        const messageDTO = msg as MessageSaveDTO;
        this.repository.create(messageDTO);
        socket.emit("message", messageDTO);
    }
}
