import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash(
  "password123", 10
  );
// ====================
// GRADES
// ====================
for (let i = 1; i <= 10; i++) {
  await prisma.grade.upsert({
    where: { level: i },
    update: {},
    create: {
      level: i,
    },
  });
}

const grades = await prisma.grade.findMany();

// ====================
// PARENTS
// ====================
const parents = [];

for (let i = 1; i <= 10; i++) {
  const parent = await prisma.parent.upsert({
    where: {
      username: `parent${i}`,
    },
    update: {},
    create: {
      username: `parent${i}`,
      firstName: `Parent${i}`,
      lastName: "Vats",
      email: `parent${i}@school.com`,
      password: hashedPassword,
      phone: `99999000${i.toString().padStart(2, "0")}`,
      address: `Address ${i}`,
    },
  });

  parents.push(parent);
}

// ====================
// TEACHERS
// ====================
const teachers = [];

for (let i = 1; i <= 50; i++) {
  const teacher = await prisma.teacher.upsert({
    where: {
      username: `teacher${i}`,
    },
    update: {},
    create: {
      username: `teacher${i}`,
      firstName: `Teacher`,
      lastName: `${i}`,
      email: `teacher${i}@school.com`,
      password: hashedPassword,
      gender: i % 2 === 0 ? "MALE" : "FEMALE",
      phone: `888880${i.toString().padStart(5, "0")}`,
      address: `Teacher Address ${i}`,
      bloodType: "O+",
    },
  });

  teachers.push(teacher);
}

// ====================
// CLASSES
// ====================
for (let i = 1; i <= 10; i++) {
  await prisma.class.upsert({
    where: {
      name: `Class ${i}`,
    },
    update: {},
    create: {
      name: `Class ${i}`,
      capacity: 40,
      gradeId: grades[i - 1].id,
      supervisorId: teachers[i - 1].id,
    },
  });
}

const classes = await prisma.class.findMany();

// ====================
// STUDENTS
// ====================
for (let i = 1; i <= 50; i++) {
  const grade = grades[(i - 1) % 10];
  const parent = parents[(i - 1) % 10];
  const cls = classes[(i - 1) % 10];

  await prisma.student.upsert({
    where: {
      username: `student${i}`,
    },
    update: {},
    create: {
      username: `student${i}`,
      firstName: `Student`,
      lastName: `${i}`,
      email: `student${i}@school.com`,
      password: hashedPassword,
      phone: `777770${i.toString().padStart(5, "0")}`,
      address: `Student Address ${i}`,
      bloodType: "A+",
      sex: i % 2 === 0 ? "MALE" : "FEMALE",
      birthday: new Date(2010, 0, i),
      parentId: parent.id,
      gradeId: grade.id,
      classId: cls.id,
    },
  });
}

console.log("✅ 10 Grades Created");
console.log("✅ 10 Parents Created");
console.log("✅ 50 Teachers Created");
console.log("✅ 10 Classes Created");
console.log("✅ 50 Students Created");
  const admin =
    await prisma.admin.upsert({
      where: {
        username: "admin",
      },
      update: {},
      create: {
        username: "admin",
        email: "admin@school.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

  console.log(
    "✅ Admin created:",
    admin.username
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });