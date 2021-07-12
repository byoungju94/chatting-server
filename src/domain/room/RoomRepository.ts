import { Repository, Sequelize } from "sequelize-typescript";
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
        return await this.repository.findAll({
            attributes: ['uuid', 'name', 'state'],
            group: ['uuid'],
            having: {
                state: RoomState.LOCKED
            }
        });
    }
}