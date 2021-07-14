import { Socket } from "socket.io";
import MessageRepository from "../../domain/message/MessageRepository";
import Handler from "./Handler";
import MessageSaveDTO from "../../domain/message/dto/MessageSaveDTO";
import { Sequelize } from "sequelize-typescript";

export default class MessageHandler implements Handler {

    private repository: MessageRepository;

    constructor(sequelize: Sequelize) {
        this.repository = new MessageRepository(sequelize);
    }
    
    public handle(socket: Socket, msg: any): void {
        const messageSaveDTO = msg as MessageSaveDTO;
        this.repository.create(messageSaveDTO);
        socket.to(messageSaveDTO.roomUuid).emit("message", messageSaveDTO);
    }
}
