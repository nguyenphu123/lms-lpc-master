const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    // await database.category.deleteMany({});

    // await database.category.createMany({
    //   data: [
    //     { name: "System Admin" },
    //     { name: "Network Security" },
    //     { name: "Service Management" },
    //     { name: "Developer" }
    //     // { name: "Accounting" },
    //     // { name: "Engineering" },
    //     // { name: "Filming" },
    //   ]
    // });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
