import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationname1703802835922 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("state_entity", "housingWeight");
        await queryRunner.dropColumn("state_entity", "farmlandWeight");
        await queryRunner.dropColumn("state_entity", "populationWeight");
        await queryRunner.dropColumn("state_entity", "foodWeight");
        await queryRunner.dropColumn("state_entity", "landWeight");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
