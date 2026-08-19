import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * The create-booking DTO already accepted a `notes` field and documented it in
 * Swagger, but there was no column to put it in, so every note sent by a client
 * was silently discarded. This adds the column the API was already promising.
 */
export class AddNotesToBookings1758101851922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bookings',
      new TableColumn({
        name: 'notes',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bookings', 'notes');
  }
}
