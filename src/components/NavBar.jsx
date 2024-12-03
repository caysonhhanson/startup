import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/NavBar.css';

export default function NavBar() {
  // This will be replaced with actual auth logic later
  const isLoggedIn = window.location.pathname !== '/';

  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="RealTime Fitness" className="logo" />
        <span className="tagline">Fitness Done Right</span>
      </div>
      <nav>
        <ul>
          {isLoggedIn ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/live">Live Session</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/">Logout</Link></li>
            </>
          ) : (
            <li><Link to="/">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}