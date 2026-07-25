-- AlterEnum
ALTER TYPE "VerificationTokenType" ADD VALUE 'EMAIL_CHANGE';

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN "newEmail" TEXT;
