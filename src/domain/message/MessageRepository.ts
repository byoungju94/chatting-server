import { Repository, Sequelize } from "sequelize-typescript";
import MessageDTO from "./dto/MessageDTO";
import MessageSaveDTO from "./dto/MessageSaveDTO";
import Message from "./Message.model";

export default class MessageRepository {

    private repository: Repository<Message>;

    constructor(sequelize: Sequelize) {
        this.repository = sequelize.getRepository(Message);
    }

    public async findByRoomUuid(roomUuid: string): Promise<Array<MessageDTO>> {
        return await this.repository.findAll({
            attributes: ['content', 'username', 'creationDate'],
            where: {
                roomUuid: roomUuid
            },
            raw: true
        });
    }

    public async create(messageSaveDTO: MessageSaveDTO): Promise<void> {
        await this.repository.create({
            content: messageSaveDTO.content,
            username: messageSaveDTO.username,
            roomUuid: messageSaveDTO.roomUuid
        });
    }

    public async clean(): Promise<void> {
        await this.repository.destroy({
            where: {},
            truncate: true
        });
    }
}   