import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export default class Message extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    content: string;

    @Column(DataType.BIGINT)
    accountId: number

    @Column(DataType.BIGINT)
    roomId: number

}
