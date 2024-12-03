import { useState, useEffect } from 'react';
import '../styles/LiveSession.css';

export default function LiveSession() {
  const [wsMessages, setWsMessages] = useState([]);
  const [nutritionInfo, setNutritionInfo] = useState(null);

  useEffect(() => {
    // Simulated WebSocket connection
    const mockWsMessage = setInterval(() => {
      setWsMessages(prev => [...prev, `Coach: Keep up the great work! ${new Date().toLocaleTimeString()}`]);
    }, 5000);

    setNutritionInfo({
      calories: 2500,
      protein: "180g",
      carbs: "250g",
      fats: "70g"
    });

    return () => clearInterval(mockWsMessage);
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