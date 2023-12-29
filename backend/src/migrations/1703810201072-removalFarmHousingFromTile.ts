import {MigrationInterface, QueryRunner} from "typeorm";

export class removalFarmHousingFromTile1703810201072 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tile_entity", "housingMax");
        await queryRunner.dropColumn("tile_entity", "farmlandMax");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
