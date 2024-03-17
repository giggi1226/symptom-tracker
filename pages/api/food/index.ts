import { getServerSession } from 'next-auth/next';
import {options} from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  console.log({req})
  const { foodToAdd } = req.body;

  const session = await getServerSession(req, res, options);
  console.log({session})
  const result = await prisma.food.create({
    data: {
      name: foodToAdd,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}