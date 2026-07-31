import { MigrationInterface, QueryRunner } from "typeorm";

export class SellerListingSchema1785485885317 implements MigrationInterface {
    name = 'SellerListingSchema1785485885317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listing_basic_details" ("property_id" uuid NOT NULL, "listing_type" "public"."listing_basic_details_listing_type_enum" NOT NULL, "property_category" "public"."listing_basic_details_property_category_enum" NOT NULL, "property_type" character varying NOT NULL, "title" character varying NOT NULL, "asking_price" numeric(15,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'CAD', "price_negotiable" boolean NOT NULL DEFAULT false, "rent_frequency" "public"."listing_basic_details_rent_frequency_enum", "description" text NOT NULL, CONSTRAINT "PK_178bb03814ac69263ee3154ec61" PRIMARY KEY ("property_id"))`);
        await queryRunner.query(`CREATE TABLE "listing_location" ("property_id" uuid NOT NULL, "street_address" character varying NOT NULL, "unit_number" character varying, "city" character varying NOT NULL, "province" character varying NOT NULL, "postal_code" character varying NOT NULL, "country" character varying NOT NULL, "latitude" numeric(10,7), "longitude" numeric(10,7), "nearby_schools" jsonb, "nearby_hospitals" jsonb, "nearby_parks" jsonb, "nearby_subway" jsonb, "nearby_bus_stops" jsonb, "nearby_grocery" jsonb, "nearby_shopping" jsonb, "nearby_restaurants" jsonb, "nearby_gyms" jsonb, "walk_score" integer, "transit_score" integer, "lifestyle_score" integer, "school_rating" integer, "investment_score" integer, "future_development_notes" text, "safety_insights" text, "flood_risk" character varying, CONSTRAINT "PK_b3f9d08b4dcad051368c076f76e" PRIMARY KEY ("property_id"))`);
        await queryRunner.query(`CREATE TABLE "listing_details" ("property_id" uuid NOT NULL, "bedrooms" integer, "bathrooms" integer, "half_bathrooms" integer, "square_feet" numeric(10,2), "lot_size" numeric(10,2), "year_built" integer, "floors" integer, "basement_type" character varying, "property_condition" character varying, "ownership_type" character varying, "interior_features" jsonb, "exterior_features" jsonb, "utilities" jsonb, "monthly_expenses" jsonb, CONSTRAINT "PK_218124d13bb1eb3094539dde341" PRIMARY KEY ("property_id"))`);
        await queryRunner.query(`CREATE TABLE "listing_media" ("media_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "media_type" "public"."listing_media_media_type_enum" NOT NULL, "url" character varying NOT NULL, "label" character varying, "ai_quality_score" integer, "ai_flags" jsonb, "is_cover" boolean NOT NULL DEFAULT false, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_075f520c33019714fa1da99d6ff" PRIMARY KEY ("media_id"))`);
        await queryRunner.query(`CREATE TABLE "listing_documents" ("doc_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "doc_type" "public"."listing_documents_doc_type_enum" NOT NULL, "url" character varying NOT NULL, "is_private" boolean NOT NULL DEFAULT true, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3a7018174894fac5b670775622" PRIMARY KEY ("doc_id"))`);
        await queryRunner.query(`CREATE TABLE "listing_availability" ("property_id" uuid NOT NULL, "available_from" date, "open_house_date" date, "viewing_days" jsonb, "viewing_time_slots" jsonb, "instant_booking" boolean NOT NULL DEFAULT false, "contact_via_platform" boolean NOT NULL DEFAULT true, "contact_phone" character varying, "contact_email" character varying, "has_agent" boolean NOT NULL DEFAULT false, "hide_phone" boolean NOT NULL DEFAULT false, "hide_email" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0e65829edc4ee72cbf9cb3902a1" PRIMARY KEY ("property_id"))`);
        await queryRunner.query(`CREATE TABLE "property_listings" ("property_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seller_id" uuid NOT NULL, "status" "public"."property_listings_status_enum" NOT NULL DEFAULT 'draft', "completion_percentage" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_694152ef958c8b0998dd6549b88" PRIMARY KEY ("property_id"))`);
        await queryRunner.query(`ALTER TABLE "listing_basic_details" ADD CONSTRAINT "FK_178bb03814ac69263ee3154ec61" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_location" ADD CONSTRAINT "FK_b3f9d08b4dcad051368c076f76e" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_details" ADD CONSTRAINT "FK_218124d13bb1eb3094539dde341" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_media" ADD CONSTRAINT "FK_a35f343fe8eef71aa9ae7962a88" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_documents" ADD CONSTRAINT "FK_0327bf672f7bb24ed811d94d662" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_availability" ADD CONSTRAINT "FK_0e65829edc4ee72cbf9cb3902a1" FOREIGN KEY ("property_id") REFERENCES "property_listings"("property_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_listings" ADD CONSTRAINT "FK_0dfb468e17083a9c04b092221ce" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_listings" DROP CONSTRAINT "FK_0dfb468e17083a9c04b092221ce"`);
        await queryRunner.query(`ALTER TABLE "listing_availability" DROP CONSTRAINT "FK_0e65829edc4ee72cbf9cb3902a1"`);
        await queryRunner.query(`ALTER TABLE "listing_documents" DROP CONSTRAINT "FK_0327bf672f7bb24ed811d94d662"`);
        await queryRunner.query(`ALTER TABLE "listing_media" DROP CONSTRAINT "FK_a35f343fe8eef71aa9ae7962a88"`);
        await queryRunner.query(`ALTER TABLE "listing_details" DROP CONSTRAINT "FK_218124d13bb1eb3094539dde341"`);
        await queryRunner.query(`ALTER TABLE "listing_location" DROP CONSTRAINT "FK_b3f9d08b4dcad051368c076f76e"`);
        await queryRunner.query(`ALTER TABLE "listing_basic_details" DROP CONSTRAINT "FK_178bb03814ac69263ee3154ec61"`);
        await queryRunner.query(`DROP TABLE "property_listings"`);
        await queryRunner.query(`DROP TABLE "listing_availability"`);
        await queryRunner.query(`DROP TABLE "listing_documents"`);
        await queryRunner.query(`DROP TABLE "listing_media"`);
        await queryRunner.query(`DROP TABLE "listing_details"`);
        await queryRunner.query(`DROP TABLE "listing_location"`);
        await queryRunner.query(`DROP TABLE "listing_basic_details"`);
    }

}
