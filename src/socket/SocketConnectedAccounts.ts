import AccountCreateDTO from "../domain/account/dto/AccountCreateDTO";

export default class SocketConnectedAccounts {

    public static store: Map<string, AccountCreateDTO> = new Map<string, AccountCreateDTO>();
}
