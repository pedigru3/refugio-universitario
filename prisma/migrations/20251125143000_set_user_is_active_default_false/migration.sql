-- Ensure isActive has a default of false and no nulls remain
ALTER TABLE "users"
ALTER COLUMN "isActive" SET DEFAULT false;

UPDATE "users"
SET "isActive" = COALESCE("isActive", false);



