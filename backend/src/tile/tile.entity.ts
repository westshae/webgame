import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TileEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    x: number;

    @Column()
    y: number;

    @Column()
    population: number;
} 