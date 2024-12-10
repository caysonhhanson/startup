import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AuthState } from './login/authState';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { LiveSession } from './live-session/liveSession';
import { Leaderboard } from './leaderboard/leaderboard';
import logo from './assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className='container-fluid'>
        <nav className='navbar fixed-top navbar-dark'>
  <div className='d-flex align-items-center'>
    <img src={logo} alt="RealTime Fitness Logo" className='nav-logo' />
    <div className='navbar-brand'>
      RealTime Fitness
    </div>
  </div>
  <menu className='navbar-nav'>
    <li className='nav-item'>
      <NavLink className='nav-link' to=''>
        Login
      </NavLink>
    </li>
    {authState === AuthState.Authenticated && (
      <>
        <li className='nav-item'>
          <NavLink className='nav-link' to='dashboard'>
            Dashboard
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='live'>
            Live Sessions
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='leaderboard'>
            Leaderboard
          </NavLink>
        </li>
      </>
    )}
  </menu>
</nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route path='/dashboard' element={<Dashboard userName={userName} />} />
          <Route path='/live' element={<LiveSession userName={userName} />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className='bg-dark text-white-50'>
          <div className='container-fluid'>
            <span className='text-reset'>RealTime Fitness</span>
            <a className='text-reset' href='https://github.com/your-repo'>
              Source
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className='text-center'>
        <h1>404: Page Not Found</h1>
        <p>The requested page does not exist.</p>
      </div>
    </main>
  );
}

export default App;