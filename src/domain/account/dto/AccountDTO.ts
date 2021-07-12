import Account from "../Account.model";

export default class AccountDTO {

    private readonly username: string;
    private readonly name: string;

    constructor(account: Account) {
        this.username = account.username;
        this.name = account.name;
    }

    public static build(account: Account): AccountDTO {
        return new AccountDTO(account);
    }
}
