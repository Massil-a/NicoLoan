/*
  Warnings:

  - You are about to alter the column `clientTag` on the `Clients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(7)`.
  - You are about to drop the column `clientId` on the `Repayments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Repayments" DROP CONSTRAINT "Repayments_clientId_fkey";

-- DropIndex
DROP INDEX "Repayments_clientId_idx";

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "clientTag" SET DATA TYPE VARCHAR(7);

-- AlterTable
ALTER TABLE "Repayments" DROP COLUMN "clientId";
