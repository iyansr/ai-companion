const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        {
          name: "Famous People",
        },
        {
          name: "Movies & TV",
        },
        {
          name: "Musicians",
        },
        {
          name: "Scientist",
        },
      ],
    });
  } catch (error) {
    console.error("error", error);
  } finally {
    await db.$disconnect();
  }
}

main();
