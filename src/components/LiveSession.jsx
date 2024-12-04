import { useState, useEffect } from 'react';
import '../styles/LiveSession.css';

export default function LiveSession() {
  const [wsMessages, setWsMessages] = useState([]);
  const [nutritionInfo, setNutritionInfo] = useState(null);

  useEffect(() => {
    // Fetch nutrition info from backend
    const fetchNutritionInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/nutrition/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition info');
        }
        const data = await response.json();
        setNutritionInfo(data);
      } catch (error) {
        console.error('Error fetching nutrition info:', error);
      }
    };

    fetchNutritionInfo();

    // WebSocket connection for live messages
    const ws = new WebSocket(`ws://${window.location.hostname}:4000/ws`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setWsMessages(prev => [...prev, message]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <main className="live-session">
      <h1>Live Workout Session</h1>
      
      <section id="live-video">
        <div className="video-placeholder">
          Placeholder for live workout video stream
        </div>
      </section>

      <section id="nutrition-info">
        <h2>Nutrition Information For You</h2>
        {nutritionInfo && (
          <div className="nutrition-data">
            <p>Your Daily Nutrition Targets:</p>
            <ul>
              <li>Calories: {nutritionInfo.calories}</li>
              <li>Protein: {nutritionInfo.protein}</li>
              <li>Carbs: {nutritionInfo.carbs}</li>
              <li>Fats: {nutritionInfo.fats}</li>
            </ul>
          </div>
        )}
      </section>

      <section id="websocket-data">
        <h2>Coach Interaction</h2>
        <div className="messages">
          {wsMessages.length === 0 ? (
            <p>Waiting for coach messages...</p>
          ) : (
            wsMessages.map((msg, index) => (
              <p key={index} className="message">{msg}</p>
            ))
          )}
        </div>
      </section>
    </main>
  );
}