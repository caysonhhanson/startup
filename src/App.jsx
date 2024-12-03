import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/live" element={<LiveSession />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;