import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Accordion, Card, Table } from 'react-bootstrap';
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AccessPanel() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState([]);

    useEffect(async () => {
        if (currentUser === null) {
            return handleRedirect("/");
        }
        if (currentUser.email !== "brenda.stephens@bmhs.org") {
            if (currentUser.email !== "jjbosscore@gmail.com") {
                return handleRedirect("/workout");
            }
        }

        const tempStudentDataLoad = [];

        await handleGetUserWorkouts(tempStudentDataLoad);
        await handleGetUserRecords(tempStudentDataLoad);
        await handleGetUserMileLog(tempStudentDataLoad);

        setStudentData(tempStudentDataLoad);
    }, []);

    function handleRedirect(screen) {
        navigate(screen);
    }

    async function handleGetUserWorkouts(tsdl) {
        const workouts = await getDocs(query(collection(db, "workouts")));
        workouts.forEach((workout) => {
            let isLoaded = false;
            for (let i = 0; i < tsdl.length; i++) {
                if (tsdl[i].email === workout.data().email) {
                    tsdl[i].workouts.push({ 
                        workout: workout.data().workout, 
                        title: workout.data().title 
                    });
                    isLoaded = true;
                }
            }
            if (!isLoaded) {
                tsdl.push({ 
                    email: workout.data().email, 
                    workouts: [{ 
                        workout: workout.data().workout, 
                        title: workout.data().title 
                    }], 
                    workoutRecords: [], 
                    mileRecords: [] 
                });
            }
        });
    }
    async function handleGetUserRecords(tsdl) {
        const records = await getDocs(query(collection(db, "records")));
        records.forEach((record) => { 
            let isLoaded = false;
            const d = new Date(record.data().Date.seconds*1000);
            let monthName = "";
            switch (d.getMonth() + 1) {
                case 1:
                    monthName = "January";
                    break;
                case 2:
                    monthName = "February";
                    break;
                case 3:
                    monthName = "March";
                    break;
                case 4:
                    monthName = "April";
                    break;
                case 5:
                    monthName = "May";
                    break;
                case 6:
                    monthName = "June";
                    break;
                case 7:
                    monthName = "July";
                    break;
                case 8:
                    monthName = "August";
                    break;
                case 9:
                    monthName = "September";
                    break;
                case 10:
                    monthName = "October";
                    break;
                case 11:
                    monthName = "November";
                    break;
                case 12:
                    monthName = "December";
                    break;
                default:
                    monthName = "Undefined";
                    break;
            };

            const dayNightCycle = d.getHours() < 12 ? "am":"pm";
            const hours = d.getHours() % 12;
            const minutes = timeFormat(d.getMinutes());
            const seconds = timeFormat(d.getSeconds());
            const milliseconds = timeFormat(d.getMilliseconds());
            
            const userDate = {
                day: d.getDate(),
                month: monthName,
                year: d.getFullYear(),
                time: `${hours}:${minutes}:${seconds}:${milliseconds} ${dayNightCycle}`,
            };
            for (let i = 0; i < tsdl.length; i++) {
                if (tsdl[i].email === record.data().Student) {
                    tsdl[i].workoutRecords.push({ 
                        Email: record.data().Student, 
                        Date: userDate, 
                        Time: record.data().Time,
                        Workout: record.data().Workout, 
                        Title: record.data()["Workout Name"] 
                    });
                    isLoaded = true;
                }
            }
            if (!isLoaded) {
                tsdl.push({ 
                    email: record.data().Student, 
                    workouts: [], 
                    workoutRecords: [{ 
                        Student: record.data().Student, 
                        Date: userDate, 
                        Time: record.data().Time, 
                        Workout: record.data().Workout, 
                        Title: record.data()["Workout Name"] 
                    }], 
                    mileRecords: [] });
            }
        });
    }
    async function handleGetUserMileLog(tsdl) {
        const mile_records = await getDocs(query(collection(db, "mile_records")));
        mile_records.forEach((mile_record) => {
            let isLoaded = false;
            const d = new Date(mile_record.data().Date.seconds*1000);
            let monthName = "";
            switch (d.getMonth() + 1) {
                case 1:
                    monthName = "January";
                    break;
                case 2:
                    monthName = "February";
                    break;
                case 3:
                    monthName = "March";
                    break;
                case 4:
                    monthName = "April";
                    break;
                case 5:
                    monthName = "May";
                    break;
                case 6:
                    monthName = "June";
                    break;
                case 7:
                    monthName = "July";
                    break;
                case 8:
                    monthName = "August";
                    break;
                case 9:
                    monthName = "September";
                    break;
                case 10:
                    monthName = "October";
                    break;
                case 11:
                    monthName = "November";
                    break;
                case 12:
                    monthName = "December";
                    break;
                default:
                    monthName = "Undefined";
                    break;
            };

            const dayNightCycle = d.getHours() < 12 ? "am":"pm";
            const hours = d.getHours() % 12;
            const minutes = timeFormat(d.getMinutes());
            const seconds = timeFormat(d.getSeconds());
            const milliseconds = timeFormat(d.getMilliseconds());
            
            const userDate = {
                day: d.getDate(),
                month: monthName,
                year: d.getFullYear(),
                time: `${hours}:${minutes}:${seconds}:${milliseconds} ${dayNightCycle}`
            };
            for (let i = 0; i < tsdl.length; i++) {
                if (tsdl[i].email === mile_record.data().Student) {
                    tsdl[i].mileRecords.push({ 
                        Email: mile_record.data().Student, 
                        Date: userDate, 
                        MilesTraveled: mile_record.data().MilesTraveled, 
                        Time: mile_record.data().Time 
                    });
                    isLoaded = true;
                }
            }
            if (!isLoaded) {
                tsdl.push({ 
                    email: mile_record.data().Student, 
                    workouts: [], 
                    workoutRecords: [], 
                    mileRecords: [{ 
                        Student: mile_record.data().Student, 
                        Date: userDate, 
                        MilesTraveled: mile_record.data().MilesTraveled, 
                        Time: mile_record.data().Time 
                    }] 
                });
            }
        });
    }
    function timeFormat(time) {
        if (time.toString().length < 2) {
            return `0${time}`;
        } else {
            return time;
        }
    }

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
            {studentData.map((val, key) => {
                return <Card key={key} style={{width: "40%", margin: "10px"}}>
                    <Card.Header style={{width: "100%", textAlign: "center"}}>
                        <h1>{val.email}</h1>
                    </Card.Header>
                    <Card.Body style={{width: "100%"}}>
                        <h2>Mile Records</h2>
                        <Accordion>
                            {val.mileRecords.length > 0 && val.mileRecords.map((subVal, subKey) => {
                                return <Accordion.Item eventKey={subKey} key={subKey}>
                                    <Accordion.Header>{subVal.Date.month} {subVal.Date.day} {subVal.Date.year} {subVal.Date.time}</Accordion.Header>
                                    <Accordion.Body>
                                        <h3>
                                            Distance: {subVal.MilesTraveled}
                                        </h3>
                                        <h3>
                                            Elapsed Time: {subVal.Time}
                                        </h3>
                                    </Accordion.Body>
                                </Accordion.Item>
                            })}
                        </Accordion>
                        <hr/>
                        <h2>Workout Records</h2>
                        <Accordion>
                            {val.workoutRecords.length > 0 && val.workoutRecords.map((subVal, subKey) => {
                                return <Accordion.Item eventKey={subKey} key={subKey}>
                                    <Accordion.Header>
                                        {subVal.Date.month} {subVal.Date.day} {subVal.Date.year} {subVal.Date.time}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <h3>
                                            Elapsed Time: {subVal.Time}
                                        </h3>
                                        <h3>
                                            Workout Title: {subVal.Title}
                                        </h3>
                                        <Table size="sm" responsive={true}>
                                            <thead>
                                                <tr>
                                                    <th>Set Name</th>
                                                    <th>Rep Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subVal.Workout.length > 0 && subVal.Workout.map((workoutVal, workoutKey) => {
                                                    return <tr key={workoutKey}>
                                                        <td>{workoutVal.workout}</td>
                                                        <td>{workoutVal.reps}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            })}
                        </Accordion>
                        <hr/>
                        <h2>Created Workouts</h2>
                        <Accordion>
                            {val.workouts.length > 0 && val.workouts.map((subVal, subKey) => {
                                return <Accordion.Item eventKey={subKey} key={subKey}>
                                    <Accordion.Header>
                                        {subVal.title}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                    <Table size="sm" responsive={true}>
                                            <thead>
                                                <tr>
                                                    <th>Set Name</th>
                                                    <th>Rep Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subVal.workout.length > 0 && subVal.workout.map((workoutVal, workoutKey) => {
                                                    return <tr key={workoutKey}>
                                                        <td>{workoutVal.workout}</td>
                                                        <td>{workoutVal.reps}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            })}
                        </Accordion>
                    </Card.Body>
                </Card>
            })}
        </div>
    )
}
