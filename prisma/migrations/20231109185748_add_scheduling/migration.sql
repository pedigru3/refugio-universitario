-- CreateTable
CREATE TABLE "schedulings" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "table" TEXT NOT NULL,
    "chair" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,

    CONSTRAINT "schedulings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_schedules" (
    "week_day" INTEGER NOT NULL,
    "time_start_in_minutes" INTEGER NOT NULL,
    "time_end_in_minutes" INTEGER NOT NULL,
    "final_day" TIMESTAMP(3)
);

-- CreateIndex
CREATE INDEX "schedulings_user_id_idx" ON "schedulings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "available_schedules_week_day_key" ON "available_schedules"("week_day");

-- AddForeignKey
ALTER TABLE "schedulings" ADD CONSTRAINT "schedulings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
