import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'
import {restoreReducer} from "next/dist/client/components/router-reducer/reducers/restore-reducer";
import {getSession} from "next-auth/react";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  let date = new Date()
  date.setHours(0,0,0,0)

  const session = await getServerSession(req, res, options);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });


  const symptoms = await prisma.symptom.findMany({
    where: {
      userId: user?.id,
      createdAt: { gte: date.toISOString()}
    },
  })

  const currentDate = new Date()
  const minDate = currentDate.getDate() - 8
  const prevDate = new Date()

  prevDate.setDate(minDate)

  const sevenDaySymptoms = await prisma.symptom.findMany({
    select: {
      createdAt: true,
    },
    where: {
      createdAt: {
        lte: currentDate.toISOString(),
        gte: prevDate.toISOString()
      },
      userId: user?.id,
      present: true
    },
    orderBy: [{
      createdAt: "asc"
    }],
    distinct: ['createdAt']
  })


  res.json({symptoms, sevenDaySymptoms});
}
