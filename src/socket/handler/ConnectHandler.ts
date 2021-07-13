import { Sequelize } from "sequelize-typescript";
import { Socket } from "socket.io";
import AccountRepository from "../../domain/account/AccountRepository";
import AccountCreateDTO from "../../domain/account/dto/AccountCreateDTO";
import SocketConnectedAccounts from "../SocketConnectedAccounts";
import Handler from "./Handler";

export default class ConnectHandler implements Handler {

    private repository: AccountRepository;

    constructor(sequelize: Sequelize) {
        this.repository = new AccountRepository(sequelize);
    }
    
    public async handle(socket: Socket, msg: any): Promise<void> {
        const accountCreateDTO = msg as AccountCreateDTO;
        SocketConnectedAccounts.store.set(socket.id, accountCreateDTO);
        await this.repository.createAsJoin(accountCreateDTO);
        socket.emit("connect", accountCreateDTO);
    }   
}
