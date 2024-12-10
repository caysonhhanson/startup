import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import './liveSession.css';

// WebSocket connection
let socket;

export function LiveSession({ userName }) {
  const [sessions, setSessions] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
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
      // Attempt to reconnect after 3 seconds
      setTimeout(initializeWebSocket, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to server');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'sessions_update') {
        setSessions(message.data);
      }
    };

    // Fetch initial sessions data
    fetchSessions();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        setError('Failed to fetch sessions');
      }
    } catch (err) {
      setError('Network error while fetching sessions');
    }
  };

  const joinSession = async (sessionId) => {
    if (!connected) {
      setError('Cannot join session: Not connected to server');
      return;
    }

    try {
      // Send join message through WebSocket
      socket.send(JSON.stringify({
        type: 'join_session',
        sessionId: sessionId,
        userName: userName
      }));
      
      // Update UI to show joined state
      setSessions(sessions.map(session => 
        session.id === sessionId 
          ? { ...session, joined: true }
          : session
      ));
    } catch (err) {
      setError('Failed to join session');
    }
  };

  const getSessionStatusBadge = (session) => {
    const now = new Date();
    const sessionTime = new Date(session.startTime);
    
    if (session.joined) {
      return <Badge bg="success">Joined</Badge>;
    } else if (sessionTime < now) {
      return <Badge bg="danger">Ended</Badge>;
    } else if (sessionTime.getTime() - now.getTime() < 30 * 60 * 1000) {
      return <Badge bg="warning">Starting Soon</Badge>;
    } else {
      return <Badge bg="primary">Upcoming</Badge>;
    }
  };

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div className="live-session-container p-4">
        <h1>Live Sessions</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {!connected && (
          <div className="alert alert-warning" role="alert">
            Connecting to server...
          </div>
        )}
        
        <Row className="mt-4">
          {sessions.map((session) => (
            <Col md={4} key={session.id} className="mb-4">
              <Card bg="dark" text="light">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {session.title}
                    {getSessionStatusBadge(session)}
                  </Card.Title>
                  <Card.Text>
                    <div>Trainer: {session.trainer}</div>
                    <div>Time: {new Date(session.startTime).toLocaleTimeString()}</div>
                    <div>Duration: {session.duration}</div>
                    <div>Level: {session.level}</div>
                    {session.participants && (
                      <div>Participants: {session.participants.length}</div>
                    )}
                  </Card.Text>
                  <Button 
                    variant="primary"
                    onClick={() => joinSession(session.id)}
                    disabled={!connected || session.joined}
                  >
                    {session.joined ? 'Joined' : 'Join Session'}
                  </Button>
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