-- AlterTable
ALTER TABLE "Parking" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favorites" TEXT[] DEFAULT ARRAY[]::TEXT[];
