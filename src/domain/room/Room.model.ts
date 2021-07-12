import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, CreatedAt } from "sequelize-typescript";
import { RoomState } from "./RoomState";

@Table({
    tableName: "tbl_room",
    timestamps: true
})
export default class Room extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    uuid: string;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.ENUM("ACTIVE", "LOCKED"))
    state: RoomState;

    @CreatedAt
    creationDate: Date;
}