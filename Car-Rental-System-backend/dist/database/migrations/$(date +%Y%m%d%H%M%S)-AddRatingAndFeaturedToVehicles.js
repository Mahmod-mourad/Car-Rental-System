"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRatingAndFeaturedToVehicles1758101851921 = void 0;
const typeorm_1 = require("typeorm");
class AddRatingAndFeaturedToVehicles1758101851921 {
    async up(queryRunner) {
        await queryRunner.addColumn('vehicles', new typeorm_1.TableColumn({
            name: 'average_rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            default: 0,
            isNullable: false,
        }));
        await queryRunner.addColumn('vehicles', new typeorm_1.TableColumn({
            name: 'review_count',
            type: 'int',
            default: 0,
            isNullable: false,
        }));
        await queryRunner.addColumn('vehicles', new typeorm_1.TableColumn({
            name: 'is_featured',
            type: 'boolean',
            default: false,
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('vehicles', 'is_featured');
        await queryRunner.dropColumn('vehicles', 'review_count');
        await queryRunner.dropColumn('vehicles', 'average_rating');
    }
}
exports.AddRatingAndFeaturedToVehicles1758101851921 = AddRatingAndFeaturedToVehicles1758101851921;
//# sourceMappingURL=$(date%20+%25Y%25m%25d%25H%25M%25S)-AddRatingAndFeaturedToVehicles.js.map