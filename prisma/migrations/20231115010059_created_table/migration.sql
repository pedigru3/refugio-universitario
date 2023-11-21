/*
  Warnings:

  - You are about to drop the column `chair` on the `schedulings` table. All the data in the column will be lost.
  - You are about to drop the column `table` on the `schedulings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedulings" DROP COLUMN "chair",
DROP COLUMN "table";

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "chair_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedulings" ADD CONSTRAINT "schedulings_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
