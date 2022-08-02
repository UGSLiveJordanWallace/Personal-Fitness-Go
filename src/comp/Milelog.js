import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Form } from "react-bootstrap";
import  TrackMiles  from "../services/Tracking";
import { googleAuthProvider } from '../firebase';

export default function Milelog() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const mileTracker = new TrackMiles();
  const [isRunning, setIsRunning] = useState(false);
  const [timeoutInt, setTimeoutInt] = useState();

  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  let tempHours = 0;
  let tempMins = 0;
  let tempSecs = 0;

  useEffect(() => {
    if(currentUser === null) {
      navigate("/", { replace: true });
    }
  }, []);

  function handleStart(e) {
    e.preventDefault();
    setIsRunning(true);
  }
  function handleStop(e) {
    e.preventDefault();
    setIsRunning(false);
  }

  function timing() {
    tempHours = parseInt(tempHours);
    tempMins = parseInt(tempMins);
    tempSecs = parseInt(tempSecs);

    if (isRunning ) {
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
    } else if (!isRunning) {
      clearTimeout(timeoutInt);
      return
    }
    setHours(tempHours);
    setMins(tempMins);
    setSecs(tempSecs);
  }

  useEffect(() => {
    timing();
  }, [isRunning])

  return (
    <>
      <Card>
        <Card.Header style={{textAlign: "center", fontSize: "3em"}}>Enter Your Run</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>Miles Traversed</Form.Label>
              <Form.Control/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Time Elapsed</Form.Label>
              <Form.Control value={`${hours}:${mins}:${secs}`}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Run</Form.Label>
              {!isRunning ? <input type="button" className='input-btn' value="Start" style={{background: 'rgb(18, 255, 16)'}} onClick={handleStart}/>
              :
              <input type="button" className='input-btn' value="Stop" style={{background: 'rgb(255, 18, 16)'}} onClick={handleStop}/>}
            </Form.Group>  
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
