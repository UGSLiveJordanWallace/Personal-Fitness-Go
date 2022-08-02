import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { Accordion, Button, Dropdown, Form, ListGroup, Table } from 'react-bootstrap'

const EW = () => {
    const workoutTitle = useRef();
    const [workoutRows, setWorkoutRows] = useState([]);
    const [loadedWorkouts, setLoadedWorkouts] = useState([]);
    const { currentUser } = useAuth();

    function addRow(e) {
        return setWorkoutRows([...workoutRows, { workout: "", reps: 0 }]);
    }

    function deleteRow(e) {
        const tempWorkoutRows = [...workoutRows];
        tempWorkoutRows.pop();
        setWorkoutRows(tempWorkoutRows);
    }

    function handleChange(e, index) {
        e.preventDefault();
        const { name, value } = e.target;
        const tempWorkoutRows = [...workoutRows];
        tempWorkoutRows[index][name] = value;
        setWorkoutRows(tempWorkoutRows);
    }

    async function saveWorkout(e) {
        e.preventDefault();

        await addDoc(collection(db, "workouts"), {
            workout: workoutRows,
            title: workoutTitle.current.value,
            email: currentUser.email
        });
        workoutTitle.current.value = "";
        setWorkoutRows([]);
        window.location.reload();
    }

    async function deleteWorkout(e, docRef) {
        e.preventDefault();

        await deleteDoc(docRef);
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
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Add Workout</Accordion.Header>
                <Accordion.Body>
                    <Form>
                        <Form.Control type="text" placeholder='Enter Workout Title' ref={workoutTitle} required/>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Workout Name</th>
                                    <th>Number of Reps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workoutRows.map((key, item) => {
                                    return (
                                        <tr key={item}>
                                            <td><input type={"text"} key={item} name="workout" value={key.workout} onChange={(e) => handleChange(e, item)}/></td>
                                            <td><input type={"number"} key={item} name="reps" value={key.reps} onChange={(e) => handleChange(e, item)} min="1" max="99"/></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <Button onClick={addRow}>Add Row</Button>
                        {' '}
                        <Button onClick={deleteRow} variant="danger">Delete Row</Button>
                        {' '}
                        <Button onClick={saveWorkout} variant="success">Save Workout</Button>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Delete Workout</Accordion.Header>
                <Accordion.Body>
                <ListGroup as="ul">
                    {loadedWorkouts.map((key, item) => {
                        return (
                            <ListGroup.Item key={item} as="li">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {key.title}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Workout Name</th>
                                                    <th>Number of Reps</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {key.workout.map((subKey, subItem) => {
                                                    return (
                                                        <tr key={subItem}>
                                                            <td><input name="workout" value={subKey.workout} disabled={true}/></td>
                                                            <td><input name="reps" value={subKey.reps} disabled={true}/></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                        <Button onClick={(e) => deleteWorkout(e, key.docRef)} variant="danger">Delete Workout</Button>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    </>
  )
}

export default EW