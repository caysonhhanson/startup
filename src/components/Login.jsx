import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Login logic will go here later
    navigate('/dashboard');
  };

  return (
    <main>
      <div className="intro section">
        <h2>Join Live Workout Sessions</h2>
        <p>Your all-in-one platform for personalized fitness training and live coach interaction.</p>
      </div>

      <div className="login section">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#">Register here</a></p>
      </div>
    </main>
  );
}