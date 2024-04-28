-- AlterTable
ALTER TABLE "available_schedules" ADD COLUMN     "end_block_in_minutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "start_block_in_minutes" INTEGER NOT NULL DEFAULT 0;
