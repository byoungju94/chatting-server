import { Sequelize } from "sequelize-typescript";
import { Socket } from "socket.io";
import AccountRepository from "../../domain/account/AccountRepository";
import AccountCreateDTO from "../../domain/account/dto/AccountCreateDTO";
import SocketConnectedAccounts from "../SocketConnectedAccounts";
import Handler from "./Handler";

export default class DisconnectHandler implements Handler {

    private repository: AccountRepository;

    constructor(sequelize: Sequelize) {
        this.repository = new AccountRepository(sequelize);
    }
    
    public handle(socket: Socket, reason: string): void {
        const accountCreateDTO: AccountCreateDTO = SocketConnectedAccounts.store.get(socket.id)!;
        if (accountCreateDTO !== undefined) {
            socket.nsp.to(accountCreateDTO.roomUuid).emit("leave", accountCreateDTO);
            this.repository.createAsLeave(accountCreateDTO);
            SocketConnectedAccounts.store.delete(socket.id);    
        }
    }
}