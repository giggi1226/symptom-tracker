import React, {useCallback, useState} from "react"
import { GetServerSideProps } from "next"
import { useSession, getSession } from 'next-auth/react';
import Layout from "../components/Layout"
import Food, { FoodProps, SymptomProps } from "../components/Post"
import prisma from '../lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper
} from '@mui/material';
import FoodInput from "../components/FoodInput";
import SymptomSurvey from "../components/SymptomSurvey";
import {useRouter} from "next/router";


export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  let date = new Date()
  date.setHours(0,0,0,0)
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { food: [] } };
  }

  const foods = await prisma.food.findMany({
    where: { authorId: session.user['user_id'], createdAt: { gte: date.toISOString()} },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  const symptoms = await prisma.symptom.findMany({
    where: { userId: session.user['id'], createdAt: { gte: date.toISOString()} },
  })

  return { 
    props: {
      foods: JSON.parse(JSON.stringify(foods)),
      symptoms: JSON.parse(JSON.stringify(symptoms))
    }
  }
}

type Props = {
  foods: FoodProps[]
  symptoms: SymptomProps[]
}

const Blog: React.FC<Props> = ({foods, symptoms}) => {
  console.log({foods, symptoms: symptoms})
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const [showInput, setShowInput] = useState(false)
  const [foodToAdd, setFoodToAdd] = useState('')


  const handleFoodChange = useCallback(event => {
    setFoodToAdd(event.target.value)
  }, [])

  const handleAddFood = useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { foodToAdd };
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 200){
        refreshData()
      }
    } catch (error) {
      console.error(error);
    }

    setShowInput(false)
  }, [foodToAdd])



  return (
    <Layout>
      <div className="page">
        {symptoms.length === 0 && <SymptomSurvey/>}
        <h1>Food Log</h1>
        <main>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Food</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {foods.map((food) => (
                  <React.Fragment key={food.id}>
                    <Food food={food}/>
                  </React.Fragment>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={() => setShowInput(true)}>Add Food</Button>
          {showInput && (
            <div>
              <FoodInput value={foodToAdd} onChangeFood={handleFoodChange}/>
              <Button onClick={handleAddFood}>Post Food</Button>
            </div>
          )}
        </main>
        <h1>Symptom Log</h1>
        <main>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Symptom</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {symptoms.map((symptom) => (
                  <React.Fragment key={symptom.id}>
                    <Food food={symptom}/>
                  </React.Fragment>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>
      <style jsx>{`
          .post {
              background: white;
              transition: box-shadow 0.1s ease-in;
          }

          .post:hover {
              box-shadow: 1px 1px 3px #aaa;
          }

          .post + .post {
              margin-top: 2rem;
          }
      `}</style>
    </Layout>
  )
}

export default Blog
