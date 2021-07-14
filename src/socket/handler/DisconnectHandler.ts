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
    
    public handle(socket: Socket, socketUuid: string): void {
        console.log("disconnectHandlerFired...");
        console.log("socket: ", socket.id);
        console.log("socketUuid: ", socketUuid);
        // console.log("")

        // const accountCreateDTO: AccountCreateDTO = SocketConnectedAccounts.store.get(socketUuid)!!;
        // socket.to(accountCreateDTO.roomUuid).emit(accountCreateDTO.name);

        // this.repository.createAsLeave(accountCreateDTO);
        // SocketConnectedAccounts.store.delete(socketUuid);
    }
}