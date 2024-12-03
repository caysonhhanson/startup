import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'HIIT Training', duration: '30 min' },
    { id: 2, name: 'Strength Building', duration: '45 min' },
    { id: 3, name: 'Cardio Blast', duration: '25 min' }
  ]);

  const [userName, setUserName] = useState("User"); // Will be replaced with actual user data later

  return (
    <main>
      <h1>Welcome, {userName}</h1>
      
      <div className="quick-actions">
        <Link to="/live" className="action-button">Join Live Session</Link>
        <Link to="/leaderboard" className="action-button">Leaderboard</Link>
      </div>

      <h2>Your Workout Progress</h2>
      <div className="progress-section">
        <div className="stat-card">
          <h3>Workout Hours</h3>
          <p>12 hours</p>
        </div>
        <div className="stat-card">
          <h3>Current Challenge</h3>
          <p>30-Day Fitness Challenge</p>
        </div>
      </div>

      <div className="workout-recommendations">
        <h2>Recommended Workout Routines</h2>
        <div id="recommended-workouts">
          <ul>
            {workouts.map(workout => (
              <li key={workout.id} className="workout-item">
                <strong>{workout.name}</strong> - {workout.duration}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}