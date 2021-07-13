import { Socket } from "socket.io";
import AccountRepository from "../../../build/domain/account/AccountRepository";
import Handler from "./Handler";

export default class DisconnectHandler implements Handler<AccountRepository> {
    
    public handle(socket: Socket, repository: AccountRepository, msg: any): void {
        throw new Error("Method not implemented.");
    }
}