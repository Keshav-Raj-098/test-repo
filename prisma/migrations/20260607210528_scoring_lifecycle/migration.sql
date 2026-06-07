-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT,
    "resumeText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "stage" TEXT NOT NULL DEFAULT 'queued',
    "error" TEXT,
    "candidateInfo" JSONB,
    "score" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "jobId" TEXT NOT NULL,
    CONSTRAINT "Scores_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scores" ("candidateInfo", "createdAt", "id", "jobId", "score", "updatedAt") SELECT "candidateInfo", "createdAt", "id", "jobId", "score", "updatedAt" FROM "Scores";
DROP TABLE "Scores";
ALTER TABLE "new_Scores" RENAME TO "Scores";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
