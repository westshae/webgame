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
    housingCount: number;

    @Column('integer')
    farmlandCount: number;

    @Column('integer')
    populationCount: number;

    @Column('integer')
    foodCount: number;

    @Column('integer')
    housingWeight: number;

    @Column('integer')
    farmlandWeight: number;

    @Column('integer')
    populationWeight: number;

    @Column('integer')
    foodWeight: number;

    @Column('integer')
    landWeight: number;
} 