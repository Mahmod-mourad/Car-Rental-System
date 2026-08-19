import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRatingAndFeaturedToVehicles1758101851921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'vehicles',
      new TableColumn({
        name: 'average_rating',
        type: 'decimal',
        precision: 3,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'vehicles',
      new TableColumn({
        name: 'review_count',
        type: 'int',
        default: 0,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'vehicles',
      new TableColumn({
        name: 'is_featured',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('vehicles', 'is_featured');
    await queryRunner.dropColumn('vehicles', 'review_count');
    await queryRunner.dropColumn('vehicles', 'average_rating');
  }
}
