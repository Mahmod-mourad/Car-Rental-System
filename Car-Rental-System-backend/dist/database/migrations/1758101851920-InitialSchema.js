"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1758101851920 = void 0;
class InitialSchema1758101851920 {
    name = 'InitialSchema1758101851920';
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'customer', 'agent')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."vehicles_type_enum" AS ENUM('sedan', 'suv', 'truck', 'van', 'luxury')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."vehicles_transmission_enum" AS ENUM('automatic', 'manual')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."vehicles_fuel_type_enum" AS ENUM('gasoline', 'diesel', 'electric', 'hybrid')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."bookings_payment_status_enum" AS ENUM('pending', 'paid', 'refunded', 'failed')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'other')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed', 'refunded', 'partially_refunded')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "last_login" TIMESTAMP,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying,
                "last_name" character varying,
                "phone" character varying,
                "avatar_url" character varying,
                "address" jsonb,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"),
                CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"),
                CONSTRAINT "FK_9e432b7df0d182f8d292902d1a1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "vehicles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "make" character varying NOT NULL,
                "model" character varying NOT NULL,
                "year" integer NOT NULL,
                "type" "public"."vehicles_type_enum" NOT NULL,
                "transmission" "public"."vehicles_transmission_enum" NOT NULL,
                "fuel_type" "public"."vehicles_fuel_type_enum" NOT NULL,
                "seats" integer NOT NULL,
                "price_per_day" numeric(10,2) NOT NULL,
                "available" boolean NOT NULL DEFAULT true,
                "location" geometry(Point, 4326),
                "images" text array NOT NULL DEFAULT '{}',
                "features" jsonb,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "owner_id" uuid NOT NULL,
                CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"),
                CONSTRAINT "FK_3e9b3a4f1f2b6e9e8f7e8e8e8e8" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "bookings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "start_date" date NOT NULL,
                "end_date" date NOT NULL,
                "total_price" numeric(10,2) NOT NULL,
                "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending',
                "payment_status" "public"."bookings_payment_status_enum" NOT NULL DEFAULT 'pending',
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "user_id" uuid NOT NULL,
                "vehicle_id" uuid NOT NULL,
                CONSTRAINT "PK_71c2a0e5e9d3dca6c3e5c2d3d3d" PRIMARY KEY ("id"),
                CONSTRAINT "FK_7e822ad1789f2592d6aaca61d60" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_55ee3f4c3c5b7f4c8e5f9e9f9e9f" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" numeric(10,2) NOT NULL,
                "payment_method" "public"."payments_payment_method_enum" NOT NULL,
                "transaction_id" character varying,
                "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
                "metadata" jsonb,
                "created_at" TIMESTAMP NOT NULL,
                "booking_id" uuid NOT NULL,
                CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"),
                CONSTRAINT "FK_6a1f9a9f9f9e9e9e9e9e9e9e9e9e" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating" integer NOT NULL,
                "comment" text,
                "response" jsonb,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP,
                "user_id" uuid NOT NULL,
                "vehicle_id" uuid NOT NULL,
                "booking_id" uuid NOT NULL,
                CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d6a" UNIQUE ("booking_id"),
                CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_6b0e2f2b2b2b2b2b2b2b2b2b2b2b" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d6a" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "reviews" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "bookings" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "vehicles" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "profiles" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."payments_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."payments_payment_method_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."bookings_payment_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."bookings_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."vehicles_fuel_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."vehicles_transmission_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."vehicles_type_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum" CASCADE`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "postgis" CASCADE`);
    }
}
exports.InitialSchema1758101851920 = InitialSchema1758101851920;
//# sourceMappingURL=1758101851920-InitialSchema.js.map