import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInquiriesAndOffers1785495273917 implements MigrationInterface {
    name = 'AddInquiriesAndOffers1785495273917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."offers_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'expired')`);
        await queryRunner.query(`CREATE TABLE "offers" ("offer_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "buyer_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "offer_price" numeric(12,2) NOT NULL, "message" text, "valid_until" date NOT NULL, "status" "public"."offers_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d611e618dbf3754ffb7fc1ffb38" PRIMARY KEY ("offer_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."inquiries_contact_preference_enum" AS ENUM('chat', 'phone', 'email')`);
        await queryRunner.query(`CREATE TYPE "public"."inquiries_status_enum" AS ENUM('new', 'read', 'replied')`);
        await queryRunner.query(`CREATE TABLE "inquiries" ("inquiry_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "buyer_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "message" text NOT NULL, "contact_preference" "public"."inquiries_contact_preference_enum" NOT NULL, "status" "public"."inquiries_status_enum" NOT NULL DEFAULT 'new', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_701dc235121d63d6119d3d2e003" PRIMARY KEY ("inquiry_id"))`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_d3c22e2807f506181f25ddf538b" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_8d62085256bc739c02d49a3c20e" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_7fc60d9f105c297d03d857ffb0a" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiries" ADD CONSTRAINT "FK_fb8f767d33104c829ea4eabeca6" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiries" ADD CONSTRAINT "FK_f6903e5ba4a1274d486f8325eb2" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiries" ADD CONSTRAINT "FK_c860a531fd90a7697efabf4efa8" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inquiries" DROP CONSTRAINT "FK_c860a531fd90a7697efabf4efa8"`);
        await queryRunner.query(`ALTER TABLE "inquiries" DROP CONSTRAINT "FK_f6903e5ba4a1274d486f8325eb2"`);
        await queryRunner.query(`ALTER TABLE "inquiries" DROP CONSTRAINT "FK_fb8f767d33104c829ea4eabeca6"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_7fc60d9f105c297d03d857ffb0a"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_8d62085256bc739c02d49a3c20e"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_d3c22e2807f506181f25ddf538b"`);
        await queryRunner.query(`DROP TABLE "inquiries"`);
        await queryRunner.query(`DROP TYPE "public"."inquiries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."inquiries_contact_preference_enum"`);
        await queryRunner.query(`DROP TABLE "offers"`);
        await queryRunner.query(`DROP TYPE "public"."offers_status_enum"`);
    }

}
