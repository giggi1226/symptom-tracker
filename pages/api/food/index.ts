import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'
import {restoreReducer} from "next/dist/client/components/router-reducer/reducers/restore-reducer";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { foodToAdd, symptoms } = req.body;

  const session = await getServerSession(req, res, options);

  const result = await prisma.food.create({
    data: {
      name: foodToAdd,
      author: { connect: { email: session?.user?.email } },
    },
  });

  const foodId = result.id;

  // Connect the symptoms to the newly created food
  await Promise.all(
    symptoms.map(symptomId =>
      prisma.foodSymptom.create({
        data: {
          food: { connect: { id: foodId } },
          symptom: { connect: { id: symptomId } },
        },
      })
    )
  );
  res.json(result);
}
