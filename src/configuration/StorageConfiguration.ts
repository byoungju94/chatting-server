import { Sequelize } from "sequelize-typescript";
import Account from "../domain/account/Account.model";
import Message from "../domain/message/Message.model";
import Room from "../domain/room/Room.model";

export default class StorageConfiguration {

    public static readonly connectionPool = new Map<string, Sequelize>();

    public static async initialize(type: string, tenant: string): Promise<Sequelize> {
        if (type === "mysql") {
            if (StorageConfiguration.connectionPool.get(tenant) === undefined) {
                const sequelize = new Sequelize({
                    repositoryMode: true,
                    database: `chat_${tenant}`,
                    dialect: 'mysql',
                    username: 'root',
                    password: "contentwave",
                });
                sequelize.addModels([Account, Room]);
                await sequelize.sync();
                StorageConfiguration.connectionPool.set(tenant, sequelize);
            }
        }

        return StorageConfiguration.connectionPool.get(tenant)!!;
    }
}
