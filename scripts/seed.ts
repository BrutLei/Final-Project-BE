import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'Web Development' },
        { name: 'Mobile Development' },
        { name: 'Data Science' },
        { name: 'Machine Learning' },
        { name: 'Artificial Intelligence' },
        { name: 'Cyber Security' },
        { name: 'Game Development' },
        { name: 'UI/UX Design' },
        { name: 'Digital Marketing' },
        { name: 'Cloud Computing' },
        { name: 'DevOps' },
        { name: 'Blockchain' },
        { name: 'Internet of Things' },
        { name: 'Augmented Reality' }
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
