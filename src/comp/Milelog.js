import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from 'react-bootstrap';
import TrackMiles from '../services/Tracking';
import NoSleep from 'nosleep.js';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export default function Milelog() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  var noSleep = new NoSleep();

  const mileTracker = new TrackMiles();
  const [milesTraveled, setMilesTraveled] = useState("0");
  const [watchId, setWatchId] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [runFinished, setRunFinished] = useState(false);
  const [timeoutInt, setTimeoutInt] = useState();

  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  let tempHours = 0;
  let tempMins = 0;
  let tempSecs = 0;

  useEffect(() => {
    if (currentUser === null) {
      navigate('/', { replace: true });
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await addDoc(collection(db, "mile_records"), {
      Student: currentUser.email,
      Time: `${hours}:${mins}:${secs}`,
      MilesTraveled: milesTraveled,
      Date: new Date()
    });
    window.location.reload();
  }

  function handleStart(e) {
    e.preventDefault();
    setIsRunning(true);
    setRunFinished(false);
    mileTracker.startTracking((milesTraveled) => {
      setMilesTraveled(milesTraveled);
    }, wId => {
      setWatchId(wId);
    });
    noSleep.enable();
    console.log('Start tracking');
  }
  function handleStop(e) {
    e.preventDefault();
    setIsRunning(false);
    setRunFinished(true);
    mileTracker.stopTracking(watchId, () => {
      console.log(watchId);
    });
    noSleep.disable();
    console.log("Mile Tracker stopped");
  }

  function timing() {
    tempHours = parseInt(tempHours);
    tempMins = parseInt(tempMins);
    tempSecs = parseInt(tempSecs);

    if (isRunning) {
      setTimeoutInt(setTimeout(timing, 1000));

      if (tempSecs >= 59) {
        tempMins = tempMins + 1;
        tempSecs = 0;
      }
      if (tempMins >= 59) {
        tempHours = tempHours + 1;
        tempMins = 0;
      }

      tempSecs = tempSecs + 1;
    } else if (!isRunning) {
      clearTimeout(timeoutInt);
      return;
    }
    setHours(timeFormat(tempHours));
    setMins(timeFormat(tempMins));
    setSecs(timeFormat(tempSecs));
  }
  function timeFormat(time) {
    if (time.toString().length < 2) {
      return `0${time}`;
    } else {
      return time;
    }
  }
  useEffect(() => {
    timing();
  }, [isRunning]);

  return (
    <>
      {!runFinished ? <Card>
        <Card.Header style={{ textAlign: 'center', fontSize: '3em' }}>
          Enter Your Run
        </Card.Header>
        <Card.Body>
          <h3>Time Elapsed: {`${hours}:${mins}:${secs}`}</h3>
          <h3>Distance Covered: {milesTraveled}</h3>
          {!isRunning ? (
            <Button
              style={{
                border: 'none',
                background: 'rgb(18, 255, 16)',
                width: '100%',
                fontSize: '2.4em',
              }}
              onClick={handleStart}
            >
              Start
            </Button>
          ) : (
            <Button
              style={{
                border: 'none',
                background: 'rgb(255, 18, 16)',
                width: '100%',
                fontSize: '2.4em',
              }}
              onClick={handleStop}
            >
              Stop
            </Button>
          )}
        </Card.Body>
      </Card>
      :
      <Card>
        <Card.Header style={{ textAlign: 'center' }}>
          Run Complete
        </Card.Header>
        <Card.Body style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h4 style={{fontSize: "3em"}}>Your Run Info</h4>
            <h4 style={{fontSize: "3em", padding: "10px"}}>Miles Traveled <span style={{color: "red"}}>{milesTraveled}</span></h4>
            <h4 style={{fontSize: "3em", padding: "10px"}}>Time <span style={{color: "limegreen"}}>{hours}:{mins}:{secs}</span></h4>
            <Button onClick={async (e) => await handleSubmit(e)} variant="primary" style={{width: "100%", fontSize: "2em"}}>Submit Workout</Button>
            <Button onClick={() => window.location.reload()} variant="dark" style={{width: "75%", fontSize: "1.25em", marginTop: "0.5em"}}>Go Back</Button>
        </Card.Body>
      </Card>}
    </>
  );
}