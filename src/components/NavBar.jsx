import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/NavBar.css';

export default function NavBar() {
  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="RealTime Fitness" className="logo" />
        <span className="tagline">Fitness Done Right</span>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/live">Live Session</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}