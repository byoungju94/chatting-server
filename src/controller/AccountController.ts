import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import AccountRepository from "../domain/account/AccountRepository";
import AccountCreateDTO from "../domain/account/dto/AccountCreateDTO";

export default class AccountController {

    private readonly accountRepository: AccountRepository;

    constructor(sequelize: Sequelize) {
        this.accountRepository = new AccountRepository(sequelize);
    }

    public async join(req: Request, res: Response, next: NextFunction): Promise<void> {
        const accountCreateDTO = req.body as AccountCreateDTO;
        await this.accountRepository.createAsJoin(accountCreateDTO);

        res.statusCode = 200;
        res.send({ result: "success" });
    }

    public async leave(req: Request, res: Response, next: NextFunction): Promise<void> {
        const accountCreateDTO = req.body as AccountCreateDTO;
        await this.accountRepository.createAsLeave(accountCreateDTO);

        res.statusCode = 200;
        res.send({ result: "success" });
    }

    public async connect(req: Request, res: Response, next: NextFunction): Promise<void> {
        const roomUuid = req.body.roomUuid;
        const connect = await this.accountRepository.connect(roomUuid);

        res.statusCode = 200;
        res.send(connect);
    }
}
