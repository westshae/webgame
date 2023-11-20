import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TileEntity {
    @PrimaryColumn('integer')
    id: number;

    @Column('integer')
    x: number;

    @Column('integer')
    y: number;

    @Column('integer')
    q: number

    @Column()
    biome: string;

    @Column('integer')
    farmlandMax: number;
    
    @Column('integer')
    housingMax: number;

    @Column('integer', {nullable:true})
    stateId: number;
} 