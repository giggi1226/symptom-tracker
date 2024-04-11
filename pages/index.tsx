import React, {useCallback, useEffect, useState} from "react"
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
import {session} from "next-auth/core/routes";


export const getServerSideProps: GetServerSideProps = async ({req, res, query}) => {
  console.log({body: query, url: req.url})

  let date = new Date()
  date.setHours(0,0,0,0)
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { food: [] } };
  }

  const currentDate = new Date()
  const minDate = currentDate.getDate() - 8
  const prevDate = new Date()

  prevDate.setDate(minDate)

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });

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

  return { 
    props: {
      sevenDaySymptoms: JSON.parse(JSON.stringify(sevenDaySymptoms)),
      userId: session?.user?.email
    }
  }
}

type Props = {
  // presentSymptoms: SymptomProps[]
  sevenDaySymptoms: SymptomProps[]
  userId: string
}

const Blog: React.FC<Props> = ({ sevenDaySymptoms, userId}) => {
  const [showInput, setShowInput] = useState(false)
  const [foodToAdd, setFoodToAdd] = useState('')
  const [userFoods, setUserFoods] = useState([]);
  const [userSymptoms, setUserSymptoms] = useState([]);
  const [foodPosted, setFoodPosted] = useState(false);
  const [symptomPosted, setSymptomPosted] = useState(false);
  const [presentSymptoms, setPresentSymptoms] = useState([])
  const [foodSymptomCorrelations, setFoodSymptomCorrelations] = useState([])

  const refreshData = async (type) => {
    const res = await fetch(`/api/${type}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (res.ok) {
      const data = await res.json();
      console.log({refreshData: data[type]}); // Ensure the response is what you expect
      return data[type];
    }

    return []
  }

  useEffect(() => {
    refreshData('foods').then(res => setUserFoods(res))

    refreshData('symptoms').then(res => {
      setUserSymptoms(res)
      const present = res.filter(symptom => symptom.present )
      setPresentSymptoms(present)
    })

  }, []);

  useEffect(() => {
    console.log({userFoods})
    if(foodPosted){
      refreshData('foods').then(res => setUserFoods(res))
      setFoodPosted(false)
    }

    if(symptomPosted){
      refreshData('symptoms').then(res => {
        setUserSymptoms(res)
        const present = res.filter(symptom => symptom.present )
        setPresentSymptoms(present)
      })

      setSymptomPosted(false)
    }

  }, [
    setFoodPosted,
    setUserFoods,
    setSymptomPosted,
    setUserSymptoms,
    userSymptoms,
    symptomPosted,
    foodPosted,
    userFoods
  ])

  const handleFoodChange = useCallback(event => {
    setFoodToAdd(event.target.value)
  }, [])

  const handleAddFood = useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { foodToAdd, symptoms: presentSymptoms?.map(symptom => symptom.id) };
      const res = await fetch(`/api/food?foodToAdd=${foodToAdd}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 200){
        const response = await res.json();
        const {data} = response
        console.log({handleAddFood: data.correlation});
        setFoodSymptomCorrelations(data.correlation)
        setFoodPosted(true)
      }

    } catch (error) {
      console.error(error);
    }

    setShowInput(false)
  }, [foodToAdd, setFoodPosted, setFoodSymptomCorrelations])

  const submitFunction = useCallback(async (data) => {
    const body = {data, userFoods}
    console.log({submitFunction: userFoods})
    try {
      const res = await fetch('/api/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 200){
        const response = await res.json();
        console.log({submitFunction: response});
        setSymptomPosted(true)
      }

    } catch (error) {
      console.error(error);
    }
  }, [userFoods])


  return (
    <Layout>
      {userId ? (
        <>
          {sevenDaySymptoms && sevenDaySymptoms.length > 6 && (
            <Paper sx={{
              width: '100%',
              height: 60,
              backgroundColor: '#cc0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}>
                <p style={{color: 'white'}}>{'You have experienced symptoms 7 days in a row.\nYou should talk to your doctor about diabetes.'}</p>
              </div>
            </Paper>
          )}
          {foodSymptomCorrelations && foodSymptomCorrelations.length > 2 && (
            <Paper sx={{
              width: '100%',
              height: 60,
              backgroundColor: '#cc0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}>
                <p style={{color: 'white'}}>{`You have experienced symptoms at least 3 times when consuming ${foodToAdd}, consider a substitute`}</p>
              </div>
            </Paper>
          )}
          <div className="page">
            {userSymptoms && userSymptoms.length === 0 && <SymptomSurvey refresh={submitFunction} />}
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
                    {userFoods && userFoods?.map((food) => (
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
                    {presentSymptoms && presentSymptoms.map((symptom) => (
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
        </>
      ) : <h1>Make sure to login on top right</h1>}

    </Layout>
  )
}

export default Blog
