import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
console.log('[Scripts Folder][Seed][Info]', 'Seeding categories...')

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'Music' },
        { name: 'Photography' },
        { name: 'Data Science' },
        { name: 'DevOps' },
        { name: 'Fitness' },
        { name: 'Computer Science' },
        { name: 'Cyber Security' },
        { name: 'Cloud Computing' },
        { name: 'Accounting' }
      ]
    })
    console.log('[Scripts Folder][Seed][Success]', 'Categories seeded successfully')
  } catch (error) {
    console.log('[Scripts Folder][Seed][Error]', error)
  } finally {
    await db.$disconnect()
  }
}

main()
