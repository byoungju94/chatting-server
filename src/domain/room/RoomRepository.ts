import { Repository, Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import RoomCreateDTO from "./dto/RoomCreateDTO";
import RoomDTO from "./dto/RoomDTO";
import RoomLockDTO from "./dto/RoomLockDTO";
import Room from "./Room.model";
import { RoomState } from "./RoomState";

export default class RoomRepository {
    
    private repository: Repository<Room>;

    constructor(sequelize: Sequelize) {
        this.repository = sequelize.getRepository(Room);
    }

    public async create(roomCreateDTO: RoomCreateDTO): Promise<void> {
        await this.repository.create({
            uuid: roomCreateDTO.uuid,
            name: roomCreateDTO.name,
            state: RoomState.ACTIVE
        });
    }

    public async createAsLock(roomLockDTO: RoomLockDTO): Promise<void> {
        await this.repository.create({
            uuid: roomLockDTO.uuid,
            name: roomLockDTO.name,
            state: RoomState.LOCKED
        });
    }

    public async stateActive(): Promise<Array<RoomDTO>> {
        const native = `
            SELECT uuid, name, state 
            FROM tbl_room as t1
                INNER JOIN (SELECT MAX(id) as id FROM tbl_room GROUP BY uuid) as t2
                ON t1.id = t2.id
            WHERE state = 'ACTIVE'
        `;

        return await this.repository.sequelize!.query(native, {
            type: QueryTypes.SELECT
        });
    }

    public async clean(): Promise<void> {
        await this.repository.destroy({
            where: {},
            truncate: true
        })
    }
}