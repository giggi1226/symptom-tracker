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


  const foods = await prisma.food.findMany({
    where: { authorId: session.user['user_id'], createdAt: { gte: date.toISOString()} },
    include: {
      author: {
        select: { name: true },
      },
    },
  })



  res.json({foods});
}
