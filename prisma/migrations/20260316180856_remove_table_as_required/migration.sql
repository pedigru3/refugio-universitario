-- DropForeignKey
ALTER TABLE "schedulings" DROP CONSTRAINT "schedulings_table_id_fkey";

-- AlterTable
ALTER TABLE "schedulings" ALTER COLUMN "table_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "schedulings" ADD CONSTRAINT "schedulings_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
