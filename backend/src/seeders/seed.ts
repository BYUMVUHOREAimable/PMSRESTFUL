// seedBooks.ts

import { Client } from "pg";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
dotenv.config(); // Load environment variables

const prisma = new PrismaClient();

async function seedParkingSlots() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const slotNumbers = Array.from({ length: 20 }, (_, i) => `A${100 + i}`); // e.g., A100, A101, ..., A119

  try {
    await client.connect();

    for (const number of slotNumbers) {
      const id = uuidv4();
      await client.query(
        `
          INSERT INTO parking_slots (id, number, "isOccupied", created_at, updated_at)
          VALUES ($1, $2, false, NOW(), NOW())
          ON CONFLICT (number) DO NOTHING
        `,
        [id, number]
      );
    }

    console.log("✅ Seeded parking slots successfully.");
  } catch (err) {
    console.error("❌ Error seeding parking slots:", err);
  } finally {
    await client.end();
  }
}

async function main() {
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists:", adminEmail);
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = await prisma.user.create({
    data: {
      firstName: "Default",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isVerified:true
    },
  });

  console.log("✅ Admin user created:", adminUser.email);
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// seedParkingSlots();
// seedUsers();

async function seedUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  // 10 users
  const users = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'Password1!' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'Secure123!' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', password: 'MyPass@2024' },
    { firstName: 'Bob', lastName: 'Williams', email: 'bob.williams@example.com', password: 'Bobby@123' },
    { firstName: 'Emma', lastName: 'Brown', email: 'emma.brown@example.com', password: 'Emma$2024' },
    { firstName: 'David', lastName: 'Davis', email: 'david.davis@example.com', password: 'D@vid123' },
    { firstName: 'Olivia', lastName: 'Miller', email: 'olivia.miller@example.com', password: 'Oli@2023' },
    { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@example.com', password: 'James!987' },
    { firstName: 'Sophia', lastName: 'Moore', email: 'sophia.moore@example.com', password: 'Sophia@12' },
    { firstName: 'Liam', lastName: 'Taylor', email: 'liam.taylor@example.com', password: 'L!am2025' },
  ];

  try {
    await client.connect();

    for (const user of users) {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await client.query(
        `
        INSERT INTO users (id, first_name, last_name, email, password, role, is_verified, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'USER', true, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
        `,
        [id, user.firstName, user.lastName, user.email, hashedPassword]
      );
    }

    console.log('✅ Seeded 10 users successfully.');
  } catch (err) {
    console.error('❌ Error seeding users:', err);
  } finally {
    await client.end();
  }
}

// seedUsers();
