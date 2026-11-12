import { prisma } from "./src/index"

async function main() {
  // Create a new user with a post
  const sandboxes = await prisma.sandbox.create({
    data: {
        status: "active",
        containerId: "23456rytfdvddfd"
    }
  })
  console.log("Created user:", sandboxes);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });