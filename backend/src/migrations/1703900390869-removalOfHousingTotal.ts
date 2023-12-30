import {MigrationInterface, QueryRunner} from "typeorm";

export class removalOfHousingTotal1703900390869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tile_entity", "housingUtil");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
