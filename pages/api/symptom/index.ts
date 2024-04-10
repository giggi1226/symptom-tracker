import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  let date = new Date()
  date.setHours(0,0,0,0)
  const session = await getServerSession(req, res, options);

  const { data: symptoms, foods } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });

  console.log({user})

  // Create symptoms
   await prisma.symptom.createMany({
    data: Object.entries(symptoms).map(([name, present]) => ({
      name,
      present: !!present, // Ensure present is boolean
      // createdAt: date.toISOString(),
      userId: user?.id
    })),
    skipDuplicates: true, // Skip if symptom with same name exists
  });

  const createdSymptoms = await prisma.symptom.findMany({
    where: {
      name: {
        in: Object.keys(symptoms), // Filter by the names of the symptoms created
      },
      createdAt: date.toISOString(),
      present: true
    },
  });

  const userSymptoms = await prisma.symptom.findMany({
    where: {
      name: {
        in: Object.keys(symptoms), // Filter by the names of the symptoms created
      },
      createdAt: date.toISOString(),
    },
  });

  console.log({email: session?.user?.email, userSymptoms, createdSymptoms, date: date.toISOString()})

  // Connect foods with symptoms
  const foodSymptomConnections = foods?.flatMap(food => {
    return createdSymptoms.map(symptom => ({
      foodId:  food.id ,
      symptomId: symptom.id,
    }));
  });

  // Create entries in FoodSymptom table
  if(foodSymptomConnections){
    await prisma.foodSymptom.createMany({
      data: foodSymptomConnections,
    });
  }

  res.json(createdSymptoms);
}