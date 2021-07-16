import { Sequelize } from "sequelize-typescript";
import Account from "../domain/account/Account.model";
import Message from "../domain/message/Message.model";
import Room from "../domain/room/Room.model";

export default class DataSourceConfiguration {

    public static readonly connectionPool = new Map<string, Sequelize>();

    public static async change(type: string, tenant: string): Promise<Sequelize> {
        if (type === "mysql") {
            if (DataSourceConfiguration.connectionPool.get(tenant) === undefined) {
                const sequelize = new Sequelize({
                    repositoryMode: true,
                    database: `chat_${tenant}`,
                    dialect: 'mysql',
                    username: 'root',
                    password: "contentwave",
                    logging: false,    
                });
                sequelize.addModels([Account, Room, Message]);

                DataSourceConfiguration.connectionPool.set(tenant, sequelize);
            }
        }

        return DataSourceConfiguration.connectionPool.get(tenant)!!;
    }
}
