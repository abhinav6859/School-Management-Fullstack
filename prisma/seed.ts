import "dotenv/config";
import { Day, PrismaClient, UserSex } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── CLEANUP (FK-safe order) ─────────────────────────────
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.admin.deleteMany();

  // Reset autoincrement sequences so IDs start from 1 again
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Grade_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Class_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Subject_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Lesson_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Exam_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Assignment_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Result_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Attendance_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Event_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Announcement_id_seq" RESTART WITH 1`);
  console.log("✔ Database cleared & sequences reset");

  // ─── ADMIN ───────────────────────────────────────────────
  await prisma.admin.createMany({
    data: [
      { id: "admin1", username: "admin1", email: "admin1@example.com", password: "admin123" },
      { id: "admin2", username: "admin2", email: "admin2@example.com", password: "admin123" },
    ],
  });
  console.log("✔ Admins seeded");

  // ─── GRADE ───────────────────────────────────────────────
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({ data: { level: i } });
  }
  // Fetch actual IDs after insert
  const grades = await prisma.grade.findMany({ orderBy: { level: "asc" } });
  console.log("✔ Grades seeded");

  // ─── CLASS ───────────────────────────────────────────────
  for (let i = 0; i < 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i + 1}A`,
        gradeId: grades[i].id,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }
  const classes = await prisma.class.findMany({ orderBy: { id: "asc" } });
  console.log("✔ Classes seeded");

  // ─── SUBJECT ─────────────────────────────────────────────
  const subjectData = [
    { name: "Mathematics" }, { name: "Science" },   { name: "English" },
    { name: "History" },     { name: "Geography" },  { name: "Physics" },
    { name: "Chemistry" },   { name: "Biology" },    { name: "Computer Science" },
    { name: "Art" },
  ];
  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }
  const subjects = await prisma.subject.findMany({ orderBy: { id: "asc" } });
  console.log("✔ Subjects seeded");

  // ─── TEACHER ─────────────────────────────────────────────
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        firstName: `TFirstName${i}`,
        lastName: `TLastName${i}`,
        username: `teacher${i}`,
        email: `teacher${i}@example.com`,
        phone: `100-200-300${i}`,
        address: `Teacher Address ${i}`,
        gender: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        bloodType: "A+",
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
        subjects: { connect: [{ id: subjects[i % 10].id }] },
        supervisedClasses: { connect: [{ id: classes[i % 6].id }] },
      },
    });
  }
  console.log("✔ Teachers seeded");

  // ─── LESSON ──────────────────────────────────────────────
  const days = Object.values(Day);
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        day: days[Math.floor(Math.random() * days.length)],
        startTime: new Date(new Date().setHours(8, 0, 0, 0)),
        endTime: new Date(new Date().setHours(9, 0, 0, 0)),
        subjectId: subjects[i % 10].id,
        classId: classes[i % 6].id,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
  }
  const lessons = await prisma.lesson.findMany({ orderBy: { id: "asc" } });
  console.log("✔ Lessons seeded");

  // ─── PARENT ──────────────────────────────────────────────
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parent${i}`,
        username: `parent${i}`,
        firstName: `PFirstName${i}`,
        lastName: `PLastName${i}`,
        email: `parent${i}@example.com`,
        phone: `200-300-400${i}`,
        address: `Parent Address ${i}`,
      },
    });
  }
  console.log("✔ Parents seeded");

  // ─── STUDENT ─────────────────────────────────────────────
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        firstName: `SFirstName${i}`,
        lastName: `SLastName${i}`,
        email: `student${i}@example.com`,
        phone: `300-400-500${i}`,
        address: `Student Address ${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
        parentId: `parent${(Math.ceil(i / 2) % 25) || 25}`,
        gradeId: grades[i % 6].id,
        classId: classes[i % 6].id,
      },
    });
  }
  console.log("✔ Students seeded");

  // ─── EXAM ────────────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    const lesson = lessons[i % lessons.length];
    await prisma.exam.create({
      data: {
        title: `Exam ${i + 1}`,
        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
        endTime: new Date(new Date().setHours(11, 0, 0, 0)),
        lessonId: lesson.id,
        teacherId: lesson.teacherId,
      },
    });
  }
  const exams = await prisma.exam.findMany({ orderBy: { id: "asc" } });
  console.log("✔ Exams seeded");

  // ─── ASSIGNMENT ──────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    const lesson = lessons[i % lessons.length];
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i + 1}`,
        startDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        lessonId: lesson.id,
        teacherId: lesson.teacherId,
      },
    });
  }
  const assignments = await prisma.assignment.findMany({ orderBy: { id: "asc" } });
  console.log("✔ Assignments seeded");

  // ─── RESULT ──────────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    await prisma.result.create({
      data: {
        score: Math.floor(Math.random() * 41) + 60,
        studentId: `student${i + 1}`,
        ...(i < 5
          ? { examId: exams[i].id }
          : { assignmentId: assignments[i - 5].id }),
      },
    });
  }
  console.log("✔ Results seeded");

  // ─── ATTENDANCE ──────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: i % 3 !== 0,
        studentId: `student${i + 1}`,
        lessonId: lessons[i % lessons.length].id,
      },
    });
  }
  console.log("✔ Attendance seeded");

  // ─── EVENT ───────────────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i + 1}`,
        description: `Description for Event ${i + 1}`,
        startTime: new Date(new Date().setHours(12, 0, 0, 0)),
        endTime: new Date(new Date().setHours(13, 0, 0, 0)),
        classId: classes[i % classes.length].id,
      },
    });
  }
  console.log("✔ Events seeded");

  // ─── ANNOUNCEMENT ────────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i + 1}`,
        description: `Description for Announcement ${i + 1}`,
        date: new Date(),
        classId: classes[i % classes.length].id,
      },
    });
  }
  console.log("✔ Announcements seeded");

  console.log("\n🎉 Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });