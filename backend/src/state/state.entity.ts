import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StateEntity {
    @PrimaryColumn()
    id: number;

    @Column('integer')
    capitalId: number;

    @Column({nullable: true})
    controllerId:string;

    @Column('integer', {array: true})
    tileIds: number[];

    @Column('integer')
    hexcode: number;

    @Column('integer', { array: true })
    decisions: number[];

    @Column('integer')
    farmUtil: number;

    @Column('integer')
    mineUtil: number;

    @Column('integer')
    population: number;

    @Column('integer')
    food: number;

    @Column('integer')
    metal: number;
} 