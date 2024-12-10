// src/live-session/liveSession.jsx
import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import './liveSession.css';

export function LiveSession() {
  const [sessions, setSessions] = React.useState([]);

  React.useEffect(() => {
    // In a full implementation, this would fetch from your backend
    const demoSessions = [
      {
        id: 1,
        title: "Morning HIIT",
        trainer: "Sarah Johnson",
        time: "8:00 AM",
        duration: "45 min",
        level: "Intermediate"
      },
      {
        id: 2,
        title: "Yoga Flow",
        trainer: "Mike Chen",
        time: "10:00 AM",
        duration: "60 min",
        level: "All Levels"
      },
      {
        id: 3,
        title: "Strength Training",
        trainer: "Alex Smith",
        time: "2:00 PM",
        duration: "50 min",
        level: "Advanced"
      }
    ];
    setSessions(demoSessions);
  }, []);

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className="live-session-container p-4">
        <h1>Live Sessions</h1>
        
        <Row className="mt-4">
          {sessions.map((session) => (
            <Col md={4} key={session.id} className="mb-4">
              <Card bg="dark" text="light">
                <Card.Body>
                  <Card.Title>{session.title}</Card.Title>
                  <Card.Text>
                    <div>Trainer: {session.trainer}</div>
                    <div>Time: {session.time}</div>
                    <div>Duration: {session.duration}</div>
                    <div>Level: {session.level}</div>
                  </Card.Text>
                  <Button variant="primary">Join Session</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {sessions.length === 0 && (
          <div className="no-sessions">
            <p>No live sessions currently scheduled</p>
          </div>
        )}
      </div>
    </main>
  );
}