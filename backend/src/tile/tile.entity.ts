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

    @Column('integer', {nullable:true})
    stateId: number;

    @Column()
    hasCapital: boolean;

    @Column('integer', {nullable:true})
    stateHexcode: number;
} 