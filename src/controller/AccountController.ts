import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import AccountCreateDTO from "../domain/account/dto/AccountCreateDTO";
import { AccountUpdateDTO } from "../domain/account/dto/AccountUpdateDTO";
import AccountRepository from "../domain/account/repository/AccountRepository";
import AccountRepositoryMysql from "../domain/account/repository/AccountRepositoryMysql";

export default class AccountController {

    private readonly accountRepository: AccountRepository;

    constructor(sequelize: Sequelize) {
        this.accountRepository = new AccountRepositoryMysql(sequelize);
    }

    public async get(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const accountDTO = await this.accountRepository.get(id);

        res.send(accountDTO);
    }

    public async post(req: Request, res: Response): Promise<void> {
        const accountCreateDTO = req.body as AccountCreateDTO;
        await this.accountRepository.create(accountCreateDTO);
        res.send({result: "success"});
    }

    public async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const accountUpdateDTO = req.body as AccountUpdateDTO;
        await this.accountRepository.update(id, accountUpdateDTO);
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await this.accountRepository.delete(id);
    }
}
