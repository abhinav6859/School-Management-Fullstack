-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "socialLinks" JSONB;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "socialLinks" JSONB;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "socialLinks" JSONB;
