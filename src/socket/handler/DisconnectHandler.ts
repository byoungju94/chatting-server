import { Socket } from "socket.io";
import AccountRepository from "../../domain/account/AccountRepository";
import AccountCreateDTO from "../../domain/account/dto/AccountCreateDTO";
import SocketConnectedAccounts from "../SocketConnectedAccounts";
import Handler from "./Handler";

export default class DisconnectHandler implements Handler<AccountRepository> {

    private repository: AccountRepository;

    constructor(repository: AccountRepository) {
        this.repository = repository;
    }
    
    public handle(socket: Socket, socketUuid: string): void {
        const accountCreateDTO: AccountCreateDTO = SocketConnectedAccounts.store.get(socketUuid)!!;
        socket.to(accountCreateDTO.roomUuid).emit(accountCreateDTO.name);

        this.repository.createAsLeave(accountCreateDTO);
        SocketConnectedAccounts.store.delete(socketUuid);
    }
}