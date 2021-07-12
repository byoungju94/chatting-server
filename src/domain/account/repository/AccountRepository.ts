import AccountCreateDTO from "../dto/AccountCreateDTO";
import AccountDTO from "../dto/AccountDTO";
import { AccountUpdateDTO } from "../dto/AccountUpdateDTO";

export default interface AccountRepository {

    get: (id: string) => Promise<AccountDTO>;
    
    create: (accountCreateDTO: AccountCreateDTO) => Promise<void>;

    update: (id: string, accountUpdateDTO: AccountUpdateDTO) => Promise<void>;

    delete: (id: string) => Promise<void>;
}