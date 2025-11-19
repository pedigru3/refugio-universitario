/*
  Warnings:

  - You are about to drop the column `accessToken` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpires` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerType` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `provider_type` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenExpires",
DROP COLUMN "providerType",
DROP COLUMN "refreshToken",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "access_token_expires" TIMESTAMP(3),
ADD COLUMN     "provider_type" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT;
