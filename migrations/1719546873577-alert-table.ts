import { MigrationInterface, QueryRunner } from "typeorm";

export class AlertTable1719546873577 implements MigrationInterface {
    name = 'AlertTable1719546873577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` int NOT NULL PRIMARY KEY COMMENT '用户id'`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD PRIMARY KEY (\`roleId\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_387a09a362c32ee04b33fc4eaa\` ON \`user_role_relation\``);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD PRIMARY KEY (\`roleId\`, \`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_387a09a362c32ee04b33fc4eaa\` ON \`user_role_relation\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD CONSTRAINT \`FK_387a09a362c32ee04b33fc4eaab\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP FOREIGN KEY \`FK_387a09a362c32ee04b33fc4eaab\``);
        await queryRunner.query(`DROP INDEX \`IDX_387a09a362c32ee04b33fc4eaa\` ON \`user_role_relation\``);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD PRIMARY KEY (\`roleId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD \`userId\` varchar(36) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_387a09a362c32ee04b33fc4eaa\` ON \`user_role_relation\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_role_relation\` ADD PRIMARY KEY (\`userId\`, \`roleId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    }

}
