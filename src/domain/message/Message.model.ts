import { AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "tbl_message",
    timestamps: true
})
export default class Message extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    content: string;

    @Column(DataType.STRING)
    username: string;

    @CreatedAt
    creationDate: Date;

    @Column(DataType.STRING)
    roomUuid: string;
}
