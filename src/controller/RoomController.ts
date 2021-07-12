import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import RoomRepository from "../domain/room/RoomRepository";

export default class RoomController {

    private readonly roomRepository: RoomRepository;

    constructor(sequelize: Sequelize) {
        this.roomRepository = new RoomRepository(sequelize);
    }

    public async start(req: Request, res: Response, next: NextFunction) {
        const uuid = req.body.uuid;
        const name = req.body.name;

        await this.roomRepository.create({
            uuid: uuid,
            name: name
        });

        res.statusCode = 200;
        res.send({result: "success"});
    }

    public async finish(req: Request, res: Response, next: NextFunction) {
        const uuid = req.body.uuid;
        const name = req.body.name;

        await this.roomRepository.createAsLock({
            uuid: uuid,
            name: name
        });

        res.statusCode = 200;
        res.send({result: "success"});
    }
}