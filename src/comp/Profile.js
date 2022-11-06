import React from 'react'
import { Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser } = useAuth();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='d-flex text-center justify-content-center'>
      {currentUser !== null ?
          <Card>
              <Card.Header>Profile</Card.Header>
              <Card.Body>
                  {currentUser !== null && <h3>Email: {currentUser.email}</h3>}
              </Card.Body>
          </Card>
        :
        <Card>
          <Card.Body>
            <h1>Not Logged In</h1>
            <Button onClick={handleLogin}>Login/Signup</Button>
          </Card.Body>
        </Card>
      }
    </div>
  )
}
