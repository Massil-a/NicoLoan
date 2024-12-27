/*
  Warnings:

  - A unique constraint covering the columns `[clientTag]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientTag` to the `Clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "clientTag" VARCHAR(15) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Clients_clientTag_key" ON "Clients"("clientTag");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_phone_key" ON "Clients"("phone");

-- CreateIndex
CREATE INDEX "Clients_userId_idx" ON "Clients"("userId");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
