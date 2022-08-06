import React from 'react'
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { login } = useAuth();
  const { logout } = useAuth();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await login();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await logout();
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{padding: "12px"}}>
        <Navbar.Brand>
          <Nav.Link href="/">Personal Fitness Go</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/workout">Workout</Nav.Link>
            <Nav.Link href="/mile-log">Mile Logging</Nav.Link>
          </Nav>
          <Nav>
            {!currentUser && <Button onClick={handleLogin}>Login/Signup</Button>}
            {currentUser && <Button onClick={handleLogout}>Logout</Button>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>    
    </div>
  )
}
