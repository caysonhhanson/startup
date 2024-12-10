// src/dashboard/dashboard.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './dashboard.css';

export function Dashboard({ userName }) {
  const [stats, setStats] = React.useState({
    workoutsCompleted: 0,
    averageRating: 0,
    nextSession: 'No upcoming sessions',
    fitnessScore: 0
  });

  React.useEffect(() => {
    // In a full implementation, this would fetch from your backend
    const fetchStats = async () => {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    };
    
    if (userName) {
      fetchStats().catch(console.error);
    }
  }, [userName]);

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className="dashboard-container p-4">
        <h1>Welcome, {userName}</h1>
        
        <Row className="mt-4">
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light">
              <Card.Body>
                <Card.Title>Workouts Completed</Card.Title>
                <Card.Text className="display-4">
                  {stats.workoutsCompleted}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light">
              <Card.Body>
                <Card.Title>Average Rating</Card.Title>
                <Card.Text className="display-4">
                  {stats.averageRating}/5
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light">
              <Card.Body>
                <Card.Title>Next Session</Card.Title>
                <Card.Text>
                  {stats.nextSession}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card bg="dark" text="light">
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
            <Card bg="dark" text="light">
              <Card.Body>
                <Card.Title>Recent Activity</Card.Title>
                <div className="activity-feed">
                  <p>No recent activity to display</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}