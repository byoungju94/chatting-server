import Account from "../Account.model";

export default class AccountDTO {

    private username: string;
    private name: string;

    constructor(account: Account) {
        this.username = account.username;
        this.name = account.name;
    }

    public static build(account: Account): AccountDTO {
        return new AccountDTO(account);
    }
}