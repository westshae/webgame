import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StateEntity {
    @PrimaryColumn()
    id: number;

    @Column('integer')
    capitalId: number;

    @Column('integer', {nullable: true})
    controllerId:number;
} 