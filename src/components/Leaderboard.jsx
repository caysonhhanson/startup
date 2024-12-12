import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initial fetch of leaderboard data
    fetchLeaderboard();

    // Setup WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'leaderboardUpdate') {
        setLeaderboardData(message.data);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(websocket);

    // Cleanup WebSocket connection
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard', {
        headers: {
          'user-id': localStorage.getItem('userId')
        }
      });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="leaderboard">
      <h1>Leaderboard</h1>
      <div className="real-time-indicator">
        <span className="dot" style={{ 
          backgroundColor: ws?.readyState === WebSocket.OPEN ? '#00ff00' : '#ff0000'
        }}></span>
        {ws?.readyState === WebSocket.OPEN ? 'Live Updates Active' : 'Live Updates Inactive'}
      </div>
      
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
                {leaderboardData
                  .sort((a, b) => b.points - a.points)
                  .map((user, index) => (
                    <tr key={user.id || index} className={
                      user.id === localStorage.getItem('userId') ? 'current-user' : ''
                    }>
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