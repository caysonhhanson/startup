import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'HIIT Training', duration: '30 min' },
    { id: 2, name: 'Strength Building', duration: '45 min' },
    { id: 3, name: 'Cardio Blast', duration: '25 min' }
  ]);

  return (
    <main>
      <div className="left-column">
        <h2>Recommended Workouts</h2>
        <div id="recommended-workouts">
          <ul>
            {workouts.map(workout => (
              <li key={workout.id}>
                {workout.name} - {workout.duration}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="right-column">
        <h2>Your Progress</h2>
        <div className="progress-stats">
          <div className="stat-card">
            <h3>Weekly Goal</h3>
            <p>3/5 workouts completed</p>
          </div>
          <div className="stat-card">
            <h3>Monthly Progress</h3>
            <p>12 workouts completed</p>
          </div>
        </div>
      </div>
    </main>
  );
}