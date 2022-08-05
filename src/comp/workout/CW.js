import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Accordion, Button, Card, Form, Table } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import "../../App.css"

const CW = () => {
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [timeoutInt, setTimeoutInt] = useState();
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
  const [loadedWorkouts, setLoadedWorkouts] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const { currentUser } = useAuth();

  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  let tempHours = 0;
  let tempMins = 0;
  let tempSecs = 0;

  function startWorkout(e) {
    e.preventDefault();
    setIsWorkingOut(true);
  }

  function stopWorkout(e, index) {
    e.preventDefault();
    setIsWorkingOut(false);
    setIsWorkoutFinished(true);
    setWorkoutTitle(loadedWorkouts[index].title);
  }

  function timing() {
    tempHours = parseInt(tempHours);
    tempMins = parseInt(tempMins);
    tempSecs = parseInt(tempSecs);

    if (isWorkingOut ) {
      setTimeoutInt(setTimeout(timing, 1000));

      if (tempSecs > 59) {
        tempMins = tempMins + 1;
        tempSecs = 0;
      }
      if (tempMins > 59) {
        tempHours = tempHours + 1;
        tempMins = 0;
      }

      tempSecs = tempSecs + 1;
    } else if (!isWorkingOut) {
      clearTimeout(timeoutInt);
      return
    }
    setHours(tempHours);
    setMins(tempMins);
    setSecs(tempSecs);
  }

  useEffect(() => {
    timing();
  }, [isWorkingOut])
  
  async function handleSubmit(e) {
    const tempLoad = loadedWorkouts.find((x) => {
      return x.title === workoutTitle;
    });

    await addDoc(collection(db, "records"), {
      Student: currentUser.email,
      "Workout Name": workoutTitle,
      Workout: tempLoad.workout,
      Time: `${hours}:${mins}:${secs}`,
      Date: new Date()
    });
    window.location.reload();
  }

  useEffect(async () => {    
    const q = query(collection(db, "workouts"), where("email", "==", currentUser.email));
    const tempLoad = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        tempLoad.push({workout: doc.data().workout, title: doc.data().title, docRef: doc.ref});
    });
    setLoadedWorkouts(tempLoad);
  }, [])

  return (
    <>
      {!isWorkoutFinished ? <Card style={{width: "85%", margin: "0 auto"}}>
        <Card.Header style={{textAlign: "center"}}>
          Start Workout
        </Card.Header>
        <Card.Body style={{position: 'relative'}}>
          <h3 className='stopwatch'>{hours}:{mins}:{secs}</h3>
          <Accordion>
            {loadedWorkouts.map((key, item) => {
              return (
                <Accordion.Item eventKey={item} key={item}>
                  <Accordion.Header>{key.title}</Accordion.Header>
                  <Accordion.Body>
                    <Table size="lg" responsive={true}>
                      <thead>
                          <tr>
                              <th>Workout Name</th>
                              <th>Reps</th>
                          </tr>
                      </thead>
                      <tbody>
                          {key.workout.map((subKey, subItem) => {
                            return (
                              <tr key={subItem}>
                                <td><input type="text" name="workout" value={subKey.workout} disabled={true}/></td>
                                <td><input type="number" name="reps" placeholder={subKey.reps} min={0} max={500} disabled={true}/></td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </Table>
                    {isWorkingOut ?
                    <Button onClick={(e) => stopWorkout(e, item)} variant="danger">End Workout</Button>
                    :
                    <Button onClick={(e) => startWorkout(e)} variant="success">Start Workout</Button>}
                  </Accordion.Body>
                </Accordion.Item>
                )
            })}
          </Accordion>
        </Card.Body>
      </Card>
      :
      <Card>
        <Card.Header style={{textAlign: "center"}}>
          <h2>Workout Complete</h2>
        </Card.Header>
        <Card.Body style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {workoutTitle && <h4 style={{fontSize: "3em"}}>Workout Name <span style={{color: "red"}}>{workoutTitle}</span></h4>} 
            <h4 style={{fontSize: "3em", padding: "10px"}}>Time <span style={{color: "limegreen"}}>{hours}:{mins}:{secs}</span></h4>
            <Button onClick={(e) => handleSubmit(e)} variant="primary" style={{width: "100%", fontSize: "2em"}}>Submit Workout</Button>
            <Button onClick={() => window.location.reload()} variant="dark" style={{width: "75%", fontSize: "1.25em", marginTop: "0.5em"}}>Go Back</Button>
        </Card.Body>
      </Card>}
    </>
  )
}

export default CW