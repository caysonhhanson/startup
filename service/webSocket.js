const { WebSocketServer } = require('ws');
const DB = require('./database.js');

const connections = new Map();

function initializeWebSocket(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    const clientData = {
      userId: null,
      authenticated: false,
      lastActivity: Date.now()
    };
    connections.set(ws, clientData);

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);
        await handleMessage(ws, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      connections.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connections.delete(ws);
    });


    sendLeaderboardUpdate(ws);
    sendSessionsUpdate(ws);
  });


  startPeriodicUpdates();
}

async function handleMessage(ws, message) {
  const clientData = connections.get(ws);
  
  switch (message.type) {
    case 'auth':
      const user = await DB.getUser(message.userName);
      if (user) {
        clientData.userId = user._id;
        clientData.authenticated = true;
        sendUserStats(ws, user);
      }
      break;

    case 'join_session':
      if (!clientData.authenticated) {
        sendError(ws, 'Authentication required');
        return;
      }
      await handleSessionJoin(ws, message.sessionId, clientData.userId);
      break;

    case 'workout_complete':
      if (!clientData.authenticated) {
        sendError(ws, 'Authentication required');
        return;
      }
      await handleWorkoutComplete(ws, message.workout, clientData.userId);
      break;

    default:
      console.warn('Unknown message type:', message.type);
  }
}

async function handleSessionJoin(ws, sessionId, userId) {
  try {
    await DB.addSessionParticipant(sessionId, userId);
    
    broadcastSessionUpdate(sessionId);
  } catch (error) {
    console.error('Error handling session join:', error);
    sendError(ws, 'Failed to join session');
  }
}

async function handleWorkoutComplete(ws, workout, userId) {
  try {
    workout.userId = userId;
    await DB.addWorkout(workout);
    
    const user = await DB.getUserById(userId);
    sendUserStats(ws, user);
    
    broadcastLeaderboard();
  } catch (error) {
    console.error('Error handling workout completion:', error);
    sendError(ws, 'Failed to record workout');
  }
}

async function broadcastLeaderboard() {
  const leaders = await DB.getLeaderboard();
  broadcast({
    type: 'leaderboard_update',
    data: leaders
  });
}

async function broadcastSessionUpdate(sessionId) {
  const session = await DB.getSessionById(sessionId);
  broadcast({
    type: 'session_update',
    data: session
  });
}

function sendUserStats(ws, user) {
  send(ws, {
    type: 'stats_update',
    data: {
      workoutsCompleted: user.workoutsCompleted,
      fitnessScore: user.fitnessScore
    }
  });
}

function sendError(ws, message) {
  send(ws, {
    type: 'error',
    data: { message }
  });
}

async function sendLeaderboardUpdate(ws) {
  const leaders = await DB.getLeaderboard();
  send(ws, {
    type: 'leaderboard_update',
    data: leaders
  });
}

async function sendSessionsUpdate(ws) {
  const sessions = await DB.getUpcomingSessions();
  send(ws, {
    type: 'sessions_update',
    data: sessions
  });
}

function send(ws, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function broadcast(message) {
  const messageStr = JSON.stringify(message);
  connections.forEach((data, ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(messageStr);
    }
  });
}

function startPeriodicUpdates() {

  setInterval(async () => {
    const sessions = await DB.getUpcomingSessions();
    broadcast({
      type: 'sessions_update',
      data: sessions
    });
  }, 30000);

  setInterval(() => {
    const now = Date.now();
    connections.forEach((data, ws) => {
      if (now - data.lastActivity > 5 * 60 * 1000) {
        ws.close();
        connections.delete(ws);
      }
    });
  }, 5 * 60 * 1000);
}

module.exports = {
  initializeWebSocket
};