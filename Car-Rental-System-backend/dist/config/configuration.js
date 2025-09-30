"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEnvVar(key, defaultValue) {
    const value = process.env[key];
    if (value === undefined && defaultValue === undefined) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value || defaultValue;
}
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    supabase: {
        url: getEnvVar('SUPABASE_URL', ''),
        key: getEnvVar('SUPABASE_KEY', ''),
        serviceRole: getEnvVar('SUPABASE_SERVICE_ROLE', ''),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        name: process.env.DATABASE_NAME || 'car_rental',
        url: process.env.DATABASE_URL,
    },
});
//# sourceMappingURL=configuration.js.map