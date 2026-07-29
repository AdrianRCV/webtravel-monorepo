-- AlterTable
ALTER TABLE "TripRequest" ADD COLUMN "viewToken" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "TripRequest_viewToken_key" ON "TripRequest"("viewToken");
