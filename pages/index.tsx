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


export const getServerSideProps: GetServerSideProps = async ({req, res, query}) => {

  let date = new Date()
  date.setHours(0,0,0,0)
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { food: [] } };
  }

  return {
    props: {
      userId: session?.user?.email,
      userName: session?.user?.name?.toLowerCase()
    }
  }
}

type Props = {
  userId: string,
  userName: string
}

const Blog: React.FC<Props> = ({ userId, userName}) => {
  const [showInput, setShowInput] = useState(false)
  const [foodToAdd, setFoodToAdd] = useState('')
  const [userFoods, setUserFoods] = useState([]);
  const [userSymptoms, setUserSymptoms] = useState([]);
  const [foodPosted, setFoodPosted] = useState(false);
  const [symptomPosted, setSymptomPosted] = useState(false);
  const [presentSymptoms, setPresentSymptoms] = useState([])
  const [foodSymptomCorrelations, setFoodSymptomCorrelations] = useState([])
  const [sevenDaySymptoms, setSevenDaySymptoms] = useState([])

  const refreshData = async (type) => {
    const res = await fetch(`/api/${type}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (res.ok) {
      const data = await res.json();
      if(type === 'symptoms'){
        return {
          ...data
        }
      }
      return data[type];
    }

    return []
  }

  useEffect(() => {
    refreshData('foods').then(res => setUserFoods(res))

    refreshData('symptoms').then(res => {
      const {symptoms} = res
      setUserSymptoms(symptoms)
      const present = symptoms.filter(symptom => symptom.present )
      console.log({emptyEffect: present})
      setPresentSymptoms(present)
    })

  }, []);

  useEffect(() => {
    if(foodPosted){
      refreshData('foods').then(res => setUserFoods(res))
      setFoodPosted(false)
    }

    if(symptomPosted){
      refreshData('symptoms').then(res => {
        const {symptoms} = res
        setUserSymptoms(symptoms)
        const present = symptoms.filter(symptom => symptom.present )
        console.log({otherEffect: present})
        setPresentSymptoms(present)
        setSevenDaySymptoms(res.sevenDaySymptoms)
      })

      setSymptomPosted(false)
    }

  }, [
    setFoodPosted,
    setUserFoods,
    setSymptomPosted,
    setUserSymptoms,
    setSevenDaySymptoms,
    userSymptoms,
    symptomPosted,
    foodPosted,
    userFoods,
    sevenDaySymptoms
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
        console.log({response})
        const {data} = response
        setFoodSymptomCorrelations(data.correlation)
        setFoodPosted(true)
      }

    } catch (error) {
      console.error(error);
    }

    setShowInput(false)
  }, [foodToAdd, setFoodPosted, setFoodSymptomCorrelations, presentSymptoms])

  const submitFunction = useCallback(async (data) => {
    const body = {data, userFoods}
    try {
      const res = await fetch('/api/symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 200){
        const response = await res.json();
        setSymptomPosted(true)
      }

    } catch (error) {
      console.error(error);
    }
  }, [userFoods])

  const addPreviousTwo = useCallback(async () => {
    setFoodSymptomCorrelations([])
    setUserFoods([])
    setUserSymptoms([])
    try {
      const res = await fetch('/api/testTwoDay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200){
        const response = await res.json();
        setSymptomPosted(true)
        setFoodPosted(true)
      }

    } catch (error) {
      console.error(error);
    }
  }, [])

  const addPreviousSix = useCallback(async () => {
    setFoodSymptomCorrelations([])
    setUserFoods([])
    setUserSymptoms([])
    try {
      const res = await fetch('/api/testSevenDay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200){
        const response = await res.json();
        setSymptomPosted(true)
      }

    } catch (error) {
      console.error(error);
    }
  }, [])

  return (
    <Layout>
      {userId ? (
        <>
          {sevenDaySymptoms && sevenDaySymptoms.length > 6 && (
            <Paper sx={{
              width: '100%',
              height: 100,
              backgroundColor: '#cc0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}>
                <p style={{color: 'white'}}>{'You have experienced symptoms 7 days in a row.\nYou should talk to your doctor about diabetes.'}</p>
                 <a
                   style={{color: 'white'}}
                    href={'https://signin.epic.com/adfs/ls/?wa=wsignin1.0&wtrealm=https%3a%2f%2fuserweb.epic.com%2f&wctx=rm%3d1%26id%3dpassive%26ru%3d%252F&wct=2024-04-21T17%3a10%3a01Z&wreply=https%3a%2f%2fuserweb.epic.com%2f'}
                    target="_blank"
                  >
                    Make Appointment here
                  </a>
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

            { (userName === "ross raiff" || userName === "giselle pacheco") && (
              <div style={{ position: 'fixed',
                padding: '10px 10px 0px 10px',
                bottom: 0,
                width: '100%',
                height: 40,
                color: 'white'}}>
              <Button onClick={addPreviousTwo}> Add previous 2 days</Button>
              <Button onClick={addPreviousSix}>Add previous 6 days</Button>
            </div>)}
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
