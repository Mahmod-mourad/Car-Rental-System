"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
const getDatabaseUrl = () => {
    const url = configService.get('DATABASE_URL');
    if (configService.get('NODE_ENV') === 'production') {
        return `${url}?sslmode=require`;
    }
    return url;
};
exports.typeOrmConfig = {
    type: 'postgres',
    url: getDatabaseUrl(),
    entities: [(0, path_1.join)(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, '../database/migrations/*{.ts,.js}')],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production' ? {
        rejectUnauthorized: false
    } : false,
    migrationsRun: false,
    migrationsTableName: 'migrations',
    installExtensions: true,
    extra: {
        connection: {
            statement_timeout: 10000,
        },
    },
};
exports.default = new typeorm_1.DataSource({
    ...exports.typeOrmConfig,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}'],
});
//# sourceMappingURL=typeorm.config.js.map