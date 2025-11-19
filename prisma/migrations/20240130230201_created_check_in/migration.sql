-- AlterTable
ALTER TABLE "schedulings" ADD COLUMN     "check_in" TIMESTAMP(3),
ADD COLUMN     "check_out" TIMESTAMP(3),
ADD COLUMN     "spent_time_in_minutes" INTEGER NOT NULL DEFAULT 60;
