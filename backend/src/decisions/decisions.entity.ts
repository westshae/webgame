import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DecisionEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    question: string;
} 