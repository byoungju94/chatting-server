import { Request, Response, NextFunction } from "express";
import { Sequelize } from "sequelize-typescript";
import MessageRepository from "../domain/message/MessageRepository";

export default class MessageController {

    private readonly messageRepository: MessageRepository;

    constructor(sequelize: Sequelize) {
        this.messageRepository = new MessageRepository(sequelize);
    }

    public async history(req: Request, res: Response, next: NextFunction) {
        const roomUuid = req.body.roomUuid;
        const history = await this.messageRepository.findByRoomUuid(roomUuid);

        res.statusCode = 200;
        res.send(history);
    }
}