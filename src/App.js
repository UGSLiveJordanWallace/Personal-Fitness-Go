import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from "./comp/Home";
import MileLog from "./comp/Milelog";
import Workout from "./comp/Workout";
import Profile from "./comp/Profile";
import { AuthProvider } from "./context/AuthContext";
import CW from "./comp/workout/CW";
import EW from "./comp/workout/EW";
import AccessPanel from "./comp/admin/AccessPanel";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Home/>
          <Routes>
            <Route path="/" element={<Profile />}/>
            <Route path="mile-log" element={<MileLog/>}/>
            <Route path="workout" element={<Workout/>}>
              <Route path="current-workouts" element={<CW/>}/>
              <Route path="edit-workouts" element={<EW/>}/>
            </Route>
            <Route path="admin" element={<AccessPanel/>}/>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}