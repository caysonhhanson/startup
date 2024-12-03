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
    <main>
      <section id="live-video">
        <h2>Live Workout Stream</h2>
        <div className="video-placeholder">
          Live workout video stream will appear here
        </div>
      </section>

      <section id="nutrition-info">
        <h2>Nutrition Information</h2>
        {nutritionInfo && (
          <div className="nutrition-data">
            <p>Daily Target: {nutritionInfo.calories} calories</p>
            <p>Protein: {nutritionInfo.protein}</p>
            <p>Carbs: {nutritionInfo.carbs}</p>
            <p>Fats: {nutritionInfo.fats}</p>
          </div>
        )}
      </section>

      <section id="websocket-data">
        <h2>Coach Interaction</h2>
        <div className="messages">
          {wsMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </section>
    </main>
  );
}