import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType } from "sequelize-typescript";

@Table
export default class Room extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    name: string
}