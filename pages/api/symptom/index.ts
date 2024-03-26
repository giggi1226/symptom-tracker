import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const symptoms = { urine: false, thirst: false, ...req.body}

  let symptomList = []

  let date = new Date()
  date.setHours(0,0,0,0)

  for (const [key, value] of Object.entries(symptoms)){
    symptomList.push({name: key, present: value || false, createdAt: date.toISOString()})
  }
  const session = await getServerSession(req, res, options);
  const data = symptomList.map(symptom => ({...symptom }))


  const result = await prisma.user.update({
    where: {email: session?.user?.email},
    data: {
      symptoms: {
        createMany: {
          data: symptomList
        }
      }
    },
  });

  res.json(result);
}