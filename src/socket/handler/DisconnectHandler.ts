import { Socket } from "socket.io";
import AccountRepository from "../../../build/domain/account/AccountRepository";
import AccountCreateDTO from "../../domain/account/dto/AccountCreateDTO";
import SocketConnectedAccounts from "../SocketConnectedAccounts";
import Handler from "./Handler";

export default class DisconnectHandler implements Handler<AccountRepository> {
    
    public handle(socket: Socket, repository: AccountRepository, socketUuid: string): void {
        const accountCreateDTO: AccountCreateDTO = SocketConnectedAccounts.store.get(socketUuid)!!;
        socket.to(accountCreateDTO.roomUuid).emit(accountCreateDTO.name);

        repository.createAsLeave(socketUuid);   
        SocketConnectedAccounts.store.delete(socketUuid);
    }
}