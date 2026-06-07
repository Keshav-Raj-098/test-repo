/*
  Warnings:

  - You are about to drop the `Rubric` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN "description" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Rubric";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ScreeningParameters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parameters" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "jobId" TEXT NOT NULL,
    CONSTRAINT "ScreeningParameters_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ScreeningParameters_jobId_key" ON "ScreeningParameters"("jobId");
