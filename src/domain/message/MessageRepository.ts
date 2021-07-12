import { Repository, Sequelize } from "sequelize-typescript";
import MessageDTO from "./dto/MessageDTO";
import MessageSaveDTO from "./dto/MessageSaveDTO";
import Message from "./Message.model";

export default class MessageRepository {

    private repository: Repository<Message>;

    constructor(sequelize: Sequelize) {
        this.repository = sequelize.getRepository(Message);
    }

    public async findByRoomId(roomId: number): Promise<Array<MessageDTO>> {
        return await this.repository.findAll({
            where: {
                roomId: roomId
            }
        });
    }

    public async save(messageSaveDTO: MessageSaveDTO): Promise<void> {
        await this.repository.create({
            content: messageSaveDTO.content,
            accountId: messageSaveDTO.accountId,
            roomId: messageSaveDTO.roomId
        });
    }

}   