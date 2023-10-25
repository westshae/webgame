import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DecisionEntity {
    @PrimaryColumn('integer')
    id: number;

    @Column()
    question: string;
} 