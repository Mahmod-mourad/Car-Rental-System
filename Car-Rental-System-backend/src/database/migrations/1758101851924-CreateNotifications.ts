import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * The web app has a notifications page and a bell in the header, but there was no
 * table, module or endpoint behind any of it — the page read a hardcoded array.
 * This adds the table those screens need.
 */
export class CreateNotifications1758101851924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "notifications_type_enum" AS ENUM (
        'booking_created',
        'booking_confirmed',
        'booking_cancelled',
        'payment_received',
        'payment_failed'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "notifications_type_enum" NOT NULL,
        "title" character varying(200) NOT NULL,
        "body" character varying(1000) NOT NULL,
        "read" boolean NOT NULL DEFAULT false,
        "reference_id" uuid,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Matches the only two queries that run: a user's list ordered by date, and
    // their unread count.
    await queryRunner.query(`
      CREATE INDEX "IDX_notifications_user_read_created"
        ON "notifications" ("user_id", "read", "created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_notifications_user_read_created"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
  }
}
