import React, { useEffect, useState } from 'react'
import { Breadcrumb, Nav, Table } from 'react-bootstrap'
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Workout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [onWorkouts, setOnWorkouts] = useState(undefined);

  useEffect(() => {
    if(currentUser === null) {
      navigate("/", { replace: true });
    }

    if (window.location.pathname === "/workout/current-workouts") {
      setOnWorkouts(true);
    } else if (window.location.pathname === "/workout/edit-workouts") {
      setOnWorkouts(false);
    }
  }, []);

  return (
    <>
      <Nav fill variant="tabs">
        <Nav.Item>
          {onWorkouts !== undefined ? <Nav.Link href="/workout/current-workouts" active={onWorkouts}>Workout</Nav.Link>:<Nav.Link href="/workout/current-workouts" active={false}>Workout</Nav.Link>}
        </Nav.Item>
        <Nav.Item>
          {onWorkouts !== undefined ? <Nav.Link href="/workout/edit-workouts" active={!onWorkouts}>Edit Workouts</Nav.Link>:<Nav.Link href="/workout/edit-workouts" active={false}>Edits Workout</Nav.Link>}
        </Nav.Item>
      </Nav>
      <Outlet/>
    </>
  )
}
