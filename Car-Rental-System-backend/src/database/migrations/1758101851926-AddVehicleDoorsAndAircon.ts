import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * The vehicle detail page lists a door count and whether the car has air
 * conditioning. Neither existed on the table, so the page read them off a
 * hardcoded object.
 */
export class AddVehicleDoorsAndAircon1758101851926
  implements MigrationInterface
{
  private readonly columns = [
    new TableColumn({ name: 'doors', type: 'int', isNullable: true }),
    new TableColumn({
      name: 'air_conditioning',
      type: 'boolean',
      isNullable: false,
      default: true,
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('vehicles', this.columns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('vehicles', this.columns);
  }
}
