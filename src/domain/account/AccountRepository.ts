import { QueryTypes } from "sequelize";
import { Repository, Sequelize } from "sequelize-typescript";
import Account from "./Account.model";
import { AccountState } from "./AccountState";
import AccountCreateDTO from "./dto/AccountCreateDTO";
import AccountDTO from "./dto/AccountDTO";

export default class AccountRepository{

    private repository: Repository<Account>;

    constructor(sequelize: Sequelize) {
        this.repository = sequelize.getRepository(Account);
    }

    public async createAsJoin(accountCreateDTO: AccountCreateDTO): Promise<void> {
        await this.repository.create({
            username: accountCreateDTO.username,
            name: accountCreateDTO.name,
            roomUuid: accountCreateDTO.roomUuid,
            state: AccountState.JOIN
        });
    }

    public async createAsLeave(accountCreateDTO: AccountCreateDTO): Promise<void> {
        await this.repository.create({
            username: accountCreateDTO.username,
            name: accountCreateDTO.name,
            roomUuid: accountCreateDTO.roomUuid,
            state: AccountState.LEAVE
        });
    }

    public async connect(roomUuid: string): Promise<Array<AccountDTO>> {
        const native = `
            SELECT username, name
            FROM tbl_account as t1
                INNER JOIN (SELECT MAX(id) as id FROM tbl_account GROUP BY username) as t2
                ON t1.id = t2.id
            WHERE roomUuid = $1 AND state = 'JOIN'
        `;

        return await this.repository.sequelize!.query(native, {
            bind: [roomUuid],
            type: QueryTypes.SELECT
        });
    }

    public async clean(): Promise<void> {
        await this.repository.destroy({
            where: {},
            truncate: true
        })
    }
}