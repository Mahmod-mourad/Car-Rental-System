import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * The booking form asks where the renter picks the car up and where they bring it
 * back, and the confirmation screen shows both. Neither had a column, so the
 * answers were dropped on the way to the API.
 */
export class AddBookingLocations1758101851925 implements MigrationInterface {
  private readonly columns = [
    new TableColumn({ name: 'pickup_location', type: 'varchar', length: '200', isNullable: true }),
    new TableColumn({ name: 'return_location', type: 'varchar', length: '200', isNullable: true }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('bookings', this.columns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('bookings', this.columns);
  }
}
