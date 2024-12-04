import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [userName, setUserName] = useState("User");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`/api/workouts/${userId}`);
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random?tags=motivational');
        const data = await response.json();
        setQuote(data.content);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote("Success is not final, failure is not fatal: it is the courage to continue that counts.");
      }
    };

    fetchWorkouts();
    fetchQuote();
  }, []);

  return (
    <main>
      <h1>Welcome, {userName}</h1>
      
      <div className="quote-section" style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        textAlign: 'center' 
      }}>
        <p><em>"{quote || 'Loading quote...'}"</em></p>
      </div>

      <div className="quick-actions">
        <Link to="/live" className="action-button">Join Live Session</Link>
        <Link to="/leaderboard" className="action-button">Leaderboard</Link>
      </div>

      <h2>Your Workout Progress</h2>
      <div className="progress-section">
        <div className="stat-card">
          <h3>Workout Hours</h3>
          <p>{workouts.reduce((total, w) => total + w.duration, 0)} hours</p>
        </div>
        <div className="stat-card">
          <h3>Current Challenge</h3>
          <p>30-Day Fitness Challenge</p>
        </div>
      </div>

      <div className="workout-box">
        <h2>Recent Workouts</h2>
        <div className="workout-content">
          <p>No recent workouts to display</p>
        </div>
      </div>
    </main>
  );
}