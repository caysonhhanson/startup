import React, { useState, useEffect } from 'react';
import { Table, Card } from 'react-bootstrap';
import './leaderboard.css';

let socket;

export function Leaderboard() {
  const [rankings, setRankings] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    initializeWebSocket();
    fetchInitialRankings();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const initializeWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    socket = new WebSocket(`${protocol}//${host}/ws`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setTimeout(initializeWebSocket, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Retrying...');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'leaderboard_update') {
        updateLeaderboard(message.data);
      }
    };
  };

  const fetchInitialRankings = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        updateLeaderboard(data);
      } else {
        setError('Failed to fetch leaderboard data');
      }
    } catch (err) {
      setError('Network error while fetching leaderboard');
    }
  };

  const updateLeaderboard = (newRankings) => {
    setRankings(newRankings);
    setLastUpdate(new Date());
  };

  const formatScore = (score) => {
    return Math.round(score).toLocaleString();
  };

  const getRowClass = (index) => {
    switch (index) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return 'bronze';
      default:
        return '';
    }
  };

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className="leaderboard-container p-4">
        <h1>Fitness Leaderboard</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {!connected && (
          <div className="alert alert-warning connecting" role="alert">
            Connecting to real-time updates...
          </div>
        )}

        <Card bg="dark" text="light" className="leaderboard-card">
          <Card.Body>
            {lastUpdate && (
              <div className="last-update">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            
            <Table hover variant="dark" className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Fitness Score</th>
                  <th>Workouts</th>
                  <th>Achievements</th>
                </tr>
              </thead>
              <tbody>
                {rankings.length > 0 ? (
                  rankings.map((entry, index) => (
                    <tr key={entry.email} className={getRowClass(index)}>
                      <td>
                        <div className="rank-badge">{index + 1}</div>
                      </td>
                      <td>{entry.email.split('@')[0]}</td>
                      <td>{formatScore(entry.fitnessScore)}</td>
                      <td>{entry.workoutsCompleted}</td>
                      <td>
                        {entry.achievements ? entry.achievements : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No leaderboard data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {connected && (
              <div className="connection-status">
                <span className="status-dot"></span>
                Live updates active
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </main>
  );
}