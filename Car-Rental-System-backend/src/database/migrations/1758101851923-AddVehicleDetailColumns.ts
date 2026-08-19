import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * The admin vehicle form already collected a description, colour, mileage and a
 * human-readable pickup location, but the vehicles table had nowhere to put any
 * of them, so the form saved to browser storage instead of the API.
 *
 * `location` already exists as a PostGIS point used for radius search. This adds
 * `location_name` next to it for the text a person actually reads.
 */
export class AddVehicleDetailColumns1758101851923 implements MigrationInterface {
  private readonly columns = [
    new TableColumn({ name: 'description', type: 'text', isNullable: true }),
    new TableColumn({ name: 'color', type: 'varchar', length: '50', isNullable: true }),
    new TableColumn({ name: 'mileage', type: 'int', isNullable: true }),
    new TableColumn({ name: 'location_name', type: 'varchar', length: '200', isNullable: true }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('vehicles', this.columns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('vehicles', this.columns);
  }
}
