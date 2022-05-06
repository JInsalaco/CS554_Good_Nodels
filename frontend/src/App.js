import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./components/Account";
import GiftPage from "./components/GiftPage";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Wedding from "./components/Wedding";
import { AuthProvider } from "./firebase/Auth";
import Events from "./components/Events";
import Users from "./components/Users";
import Profile from "./components/Profile";
import AttendingWeddings from "./components/AttendingWeddings";
import NotFound from "./components/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navigation />
          </header>
        </div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/weddings/:id" element={<PrivateRoute />}>
            <Route path="/weddings/:id" element={<Wedding />} />
          </Route>
          <Route path="/weddings/my-wedding" element={<PrivateRoute />}>
            <Route path="/weddings/my-wedding" element={<Users />} />
          </Route>
          <Route path="/weddings/attending" element={<PrivateRoute />}>
            <Route path="/weddings/attending" element={<AttendingWeddings />} />
          </Route>
          <Route path="/gifts/:id" element={<PrivateRoute />}>
            <Route path="/gifts/:id" element={<GiftPage />} />
          </Route>
          <Route path="/events" element={<PrivateRoute />}>
            <Route path="/events" element={<Events />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} status={404} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
