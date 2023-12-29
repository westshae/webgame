import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCountToUtil1703807839235 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE state_entity RENAME COLUMN housingCount TO housingUtil`);
        await queryRunner.query(`ALTER TABLE state_entity RENAME COLUMN farmlandCount TO farmUtil`);

        await queryRunner.query(`ALTER TABLE state_entity RENAME COLUMN populationCount TO population`);
        await queryRunner.query(`ALTER TABLE state_entity RENAME COLUMN foodCount TO food`);

        await queryRunner.query(`ALTER TABLE state_entity ADD COLUMN mine INT`);

        await queryRunner.query(`ALTER TABLE state_entity ADD COLUMN mineUtil INT`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
