import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DecisionEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    question: string;
} 