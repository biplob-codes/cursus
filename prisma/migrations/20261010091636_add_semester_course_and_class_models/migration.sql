-- CreateEnum
CREATE TYPE "SemesterName" AS ENUM ('FALL', 'SPRING', 'SUMMER');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "Semester" (
    "id" TEXT NOT NULL,
    "name" "SemesterName" NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "gradePoint" DOUBLE PRECISION,
    "teacher" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "semesterId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "roomNo" TEXT,
    "startsAt" TEXT NOT NULL,
    "endsAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Semester_userId_idx" ON "Semester"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_userId_name_year_key" ON "Semester"("userId", "name", "year");

-- CreateIndex
CREATE INDEX "Course_semesterId_idx" ON "Course"("semesterId");

-- CreateIndex
CREATE INDEX "Course_courseCode_idx" ON "Course"("courseCode");

-- CreateIndex
CREATE INDEX "Class_courseId_idx" ON "Class"("courseId");

-- CreateIndex
CREATE INDEX "Class_day_idx" ON "Class"("day");

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
