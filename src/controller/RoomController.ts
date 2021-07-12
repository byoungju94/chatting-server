import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import RoomRepository from "../domain/room/RoomRepository";

export default class RoomController {

    private readonly roomRepository: RoomRepository;

    constructor(sequelize: Sequelize) {
        this.roomRepository = new RoomRepository(sequelize);
    }

    public async start(req: Request, res: Response): Promise<void> {
        const uuid = req.params.uuid;
        const name = req.params.name;

        await this.roomRepository.create({
            uuid: uuid,
            name: name
        });

        res.send({result: "success"});
    }

    public async finish(req: Request, res: Response): Promise<void> {
        const uuid = req.params.uuid;
        const name = req.params.name;

        await this.roomRepository.createAsLock({
            uuid: uuid,
            name: name
        });

        res.send({result: "success"});
    }
}