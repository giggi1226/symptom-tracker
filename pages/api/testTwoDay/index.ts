import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  const session = await getServerSession(req, res, options);
  const foodToAdd = 'Hamburger'
  let yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0,0,0,0)

  await prisma.foodSymptom.deleteMany({})
  await prisma.symptom.deleteMany({})
  await prisma.food.deleteMany({})

  // create food for yesterday
  const foodYesterday = await prisma.food.create({
    data: {
      name: foodToAdd,
      author: { connect: { email: session?.user?.email } },
      createdAt: yesterday.toISOString()
    },
  });

  //create symptoms for yesterday
  const symptomYesterday = await prisma.symptom.create({
    data: {
      name: 'thirst',
      user: { connect: { email: session?.user?.email } },
      present: true,
      createdAt: yesterday.toISOString()
    }
  })

  // create foodSymptoms for yesterday
  const yesterdayFoodSymptom = await prisma.foodSymptom.create({
    data: {
      foodId: foodYesterday.id,
      symptomId: symptomYesterday.id
    }
  })

  // create food for 2 days agot
  let twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(0,0,0,0)

  const foodTwoDaysAgo = await prisma.food.create({
    data: {
      name: foodToAdd,
      author: { connect: { email: session?.user?.email } },
      createdAt: twoDaysAgo.toISOString()
    },
  });

  //create symptoms for two days ago
  const symptomTwoDaysAgo = await prisma.symptom.create({
    data: {
      name: 'thirst',
      user: { connect: { email: session?.user?.email } },
      present: true,
      createdAt: twoDaysAgo.toISOString()
    }
  })

  // create foodSymptoms for twoDaysAgo
  const twoDaysAgoFoodSymptom = await prisma.foodSymptom.create({
    data: {
      foodId: foodTwoDaysAgo.id,
      symptomId: symptomTwoDaysAgo.id
    }
  })

  res.json({
    data: {
      foodYesterday,
      symptomYesterday,
      yesterdayFoodSymptom
    }
  });
}
