import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * A rental needs the driver's licence number on the booking. The form asked for
 * it and marked it required, then dropped it — there was no column.
 */
export class AddBookingDriverLicense1758101851927
  implements MigrationInterface
{
  private readonly column = new TableColumn({
    name: 'driver_license',
    type: 'varchar',
    length: '50',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('bookings', this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bookings', 'driver_license');
  }
}
