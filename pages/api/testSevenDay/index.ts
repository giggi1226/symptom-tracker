import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  const session = await getServerSession(req, res, options);
  let date = new Date()

  await prisma.foodSymptom.deleteMany({})
  await prisma.symptom.deleteMany({})
  await prisma.food.deleteMany({})

  const promises = []

  for (let i = 1; i < 7; i++) {
    date.setDate(date.getDate() - 1);
    date.setHours(0,0,0,0)
    promises.push(prisma.symptom.create({
      data: {
        name: 'thirst',
        user: { connect: { email: session?.user?.email } },
        present: true,
        createdAt: date.toISOString()
      }
    }))
  }

  await Promise.all(promises)


  res.json('Success');
}
