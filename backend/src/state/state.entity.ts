import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StateEntity {
    @PrimaryColumn()
    id: number;

    @Column('integer')
    capitalId: number;

    @Column('integer', {nullable: true})
    controllerId:number;

    @Column('integer', {array: true})
    tileIds: number[];

    @Column('integer')
    hexcode: number;

    @Column('jsonb')
    decisions: string[];
} 