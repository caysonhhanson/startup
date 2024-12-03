import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: 'John Doe', points: 1200, workouts: 15 },
    { id: 2, name: 'Jane Smith', points: 1150, workouts: 14 },
    { id: 3, name: 'Mike Johnson', points: 1100, workouts: 13 }
  ]);

  return (
    <main>
      <h2>Top Performers</h2>
      <div id="db-data">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
              <th>Workouts</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.points}</td>
                <td>{user.workouts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}