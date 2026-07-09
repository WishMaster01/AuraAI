import prisma from "./prisma.js";

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error(
      "PostgreSQL connection failed: set DATABASE_URL to your Neon Postgres connection string in server/.env"
    );
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log("PostgreSQL connected with Prisma");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error?.message || error);
    process.exit(1);
  }
};

export default connectDB;
