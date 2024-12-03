import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import LiveSession from './components/LiveSession';
import Leaderboard from './components/Leaderboard';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live" element={<LiveSession />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <footer className='bg-dark text-white-50'>
          <div className='container-fluid'>
            <span className='text-reset'>© 2024 RealTime Fitness by Cayson Hunter Hanson</span>
            <a className='text-reset' href='https://github.com/caysonhhanson/startup.git'>
              Source
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;