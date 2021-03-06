import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AccountState } from "./AccountState";

@Table({
    tableName: "tbl_account",
    timestamps: true
})
export default class Account extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    username: string;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    roomUuid: string;

    @Column(DataType.ENUM(AccountState.JOIN, AccountState.LEAVE))
    state: AccountState;
}
