import { AutoIncrement, Column, CreatedAt, PrimaryKey, Table, UpdatedAt, Model, DataType } from "sequelize-typescript";
import { AccountState } from "./AccountState";

@Table
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
    password: string;

    @Column(DataType.ENUM("ACTIVE", "LOCKED"))
    state: AccountState
}
