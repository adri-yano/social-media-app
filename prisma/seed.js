import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { username: 'alice', name: 'Alice', email: 'alice@example.com', password },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { username: 'bob', name: 'Bob', email: 'bob@example.com', password },
  })

  await prisma.post.createMany({
    data: [
      { content: 'Hello from Alice', authorId: alice.id },
      { content: 'Hello from Bob', authorId: bob.id },
    ],
  })

  console.log('Seeded.')
}

main().finally(async () => {
  await prisma.$disconnect()
})


