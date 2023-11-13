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

    @Column('jsonb')
    decisions: string[];
} 