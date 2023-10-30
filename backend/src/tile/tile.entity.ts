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

    @Column('integer', { array: true, nullable: true })
    connectedTiles: number[];

    @Column('integer')
    population: number;

    @Column()
    biome: string;

    @Column('integer')
    farmland: number;

    @Column('integer')
    farmlandUtilized: number;

    @Column('integer', {nullable:true})
    ownerUserId: number;
} 