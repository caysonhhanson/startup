import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './dashboard.css';

let socket;

export function Dashboard({ userName }) {
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    averageRating: 0,
    nextSession: 'No upcoming sessions',
    fitnessScore: 0
  });
  const [activities, setActivities] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeWebSocket();
    fetchInitialData();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userName]);

  const initializeWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    socket = new WebSocket(`${protocol}//${host}/ws`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
      
      // Send authentication
      socket.send(JSON.stringify({
        type: 'auth',
        userName: userName
      }));
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
      handleWebSocketMessage(message);
    };
  };

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'stats_update':
        setStats(prevStats => ({
          ...prevStats,
          ...message.data
        }));
        break;
      case 'activity_update':
        setActivities(prevActivities => {
          const newActivities = [message.data, ...prevActivities];
          return newActivities.slice(0, 10); // Keep only last 10 activities
        });
        break;
      case 'next_session_update':
        setStats(prevStats => ({
          ...prevStats,
          nextSession: message.data
        }));
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const fetchInitialData = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch user stats');
      }
    } catch (err) {
      setError('Network error while fetching data');
    }
  };

  const formatActivityTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className="dashboard-container p-4">
        <h1>Welcome, {userName}</h1>
        
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
        
        <Row className="mt-4">
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light" className="stats-card">
              <Card.Body>
                <Card.Title>Workouts Completed</Card.Title>
                <Card.Text className="display-4">
                  {stats.workoutsCompleted}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light" className="stats-card">
              <Card.Body>
                <Card.Title>Average Rating</Card.Title>
                <Card.Text className="display-4">
                  {stats.averageRating.toFixed(1)}/5
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light" className="stats-card">
              <Card.Body>
                <Card.Title>Next Session</Card.Title>
                <Card.Text>
                  {stats.nextSession}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light" className="stats-card">
              <Card.Body>
                <Card.Title>Fitness Score</Card.Title>
                <Card.Text className="display-4">
                  {stats.fitnessScore}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}>
            <Card bg="dark" text="light" className="activity-card">
              <Card.Body>
                <Card.Title>Recent Activity</Card.Title>
                <div className="activity-feed">
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-time">
                          {formatActivityTime(activity.timestamp)}
                        </div>
                        <div className="activity-description">
                          {activity.description}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-activity">No recent activity to display</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}