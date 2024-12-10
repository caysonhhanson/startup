import React from 'react';
import { Table } from 'react-bootstrap';
import './leaderboard.css';

export function Leaderboard() {
  const [rankings, setRankings] = React.useState([]);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setRankings(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className="leaderboard-container p-4">
        <h1>Fitness Leaderboard</h1>
        
        <Table striped bordered hover variant="dark" className="mt-4">
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
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.fitnessScore}</td>
                  <td>{entry.workouts}</td>
                  <td>{entry.achievements}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No leaderboard data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </main>
  );
}