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
    population: number;

    @Column('numeric')
    biome: number;
} 