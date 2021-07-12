import { Repository, Sequelize } from "sequelize-typescript";
import Account from "../Account.model";
import { AccountState } from "../AccountState";
import AccountCreateDTO from "../dto/AccountCreateDTO";
import AccountDTO from "../dto/AccountDTO";
import { AccountUpdateDTO } from "../dto/AccountUpdateDTO";
import AccountRepository from "./AccountRepository";

export default class AccountRepositoryMysql implements AccountRepository {

    private repository: Repository<Account>;

    constructor(sequelize: Sequelize) {
        this.repository = sequelize.getRepository(Account);
    }
    
    public async get(id: string): Promise<AccountDTO> {
        const account = await this.repository.findOne({ where: { id: id }});
        return AccountDTO.build(account!!);
    }

    public async create(accountCreateDTO: AccountCreateDTO): Promise<void> {
        await this.repository.create({
            username: accountCreateDTO.username,
            name: accountCreateDTO.name,
            password: accountCreateDTO.password
        });
    }

    public async update(id: string, accountUpdateDTO: AccountUpdateDTO): Promise<void> {
        await this.repository.update({
            name: accountUpdateDTO.name,
            password: accountUpdateDTO.password
        }, {
            where: { id: id}
        });
    }

    public async delete(id: string): Promise<void> {
        await this.repository.update({
            state: AccountState.LOCKED
        }, {
            where: {id: id}
        })
    }
}