import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="leaderboard">
      <h1>Leaderboard</h1>
      
      <section className="top-performers">
        <h2>Top Performers</h2>
        <div id="db-data">
          {leaderboardData.length === 0 ? (
            <p>No leaderboard data available</p>
          ) : (
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
          )}
        </div>
      </section>
    </main>
  );
}