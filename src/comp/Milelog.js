import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Form, Button } from 'react-bootstrap';
import TrackMiles from '../services/Tracking';

export default function Milelog() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const mileTracker = new TrackMiles();
  const [currentMilesTraversed, setCurrentMilesTraversed] = useState("0");
  const [isRunning, setIsRunning] = useState(false);
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

  function handleStart(e) {
    e.preventDefault();
    setIsRunning(true);
    mileTracker.startTracking((milesTraveled, latitude, longitude, newDistance) => {
      setCurrentMilesTraversed(`${milesTraveled} ${latitude} ${longitude} ${newDistance}`);
    });
  }
  function handleStop(e) {
    e.preventDefault();
    setIsRunning(false);
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
    setHours(tempHours);
    setMins(tempMins);
    setSecs(tempSecs);
  }

  useEffect(() => {
    timing();
  }, [isRunning]);

  return (
    <>
      <Card>
        <Card.Header style={{ textAlign: 'center', fontSize: '3em' }}>
          Enter Your Run
        </Card.Header>
        <Card.Body>
          <h3>Time Elapsed: {`${hours}:${mins}:${secs}`}</h3>
          <h3>Distance Covered: {currentMilesTraversed}</h3>
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
    </>
  );
}
