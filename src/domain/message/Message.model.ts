import { AutoIncrement, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Room from "../room/Room.model";

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

    @ForeignKey(() => Room)
    @Column(DataType.BIGINT)
    roomId: number;

    @BelongsTo(() => Room)
    room: Room;
}
