import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import MessageRepository from "../domain/message/MessageRepository";

export default class MessageController {

    private readonly messageRepository: MessageRepository;

    constructor(sequelize: Sequelize) {
        this.messageRepository = new MessageRepository(sequelize);
    }

    public async history(req: Request, res: Response): Promise<void> {
        const roomId = parseInt(req.params.roomId);
        const history = await this.messageRepository.findByRoomId(roomId);
        res.send(history);
    }
}