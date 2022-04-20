import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Account from './components/Account';
import GiftPage from './components/GiftPage';
import Home from './components/Home';
import Landing from './components/Landing';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Wedding from './components/Wedding';
import { AuthProvider } from './firebase/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <header className='App-header'>
            <Navigation />
          </header>
        </div>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/account' element={<PrivateRoute />}>
            <Route path='/account' element={<Account />} />
          </Route>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/weddings/:id' element={<Wedding />} />
          <Route path='/gifts/:id' element={<GiftPage />}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;