import { Socket } from "socket.io";
import AccountRepository from "../../../build/domain/account/AccountRepository";
import AccountCreateDTO from "../../domain/account/dto/AccountCreateDTO";
import Handler from "./Handler";

export default class ConnectHandler implements Handler<AccountRepository> {
    
    public async handle(socket: Socket, repository: AccountRepository, msg: any): Promise<void> {
        const accountCreateDTO = msg as AccountCreateDTO;
        await repository.createAsJoin(accountCreateDTO);
        socket.emit("connect", accountCreateDTO);
    }   
}
