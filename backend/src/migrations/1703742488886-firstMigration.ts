import { DatabaseConnectionService } from 'src/database-connection.service';
import {MigrationInterface, QueryRunner} from 'typeorm';

export class firstMigration1703742488886 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("state_entity", "housingWeight");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
