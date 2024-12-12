import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Authentication failed');
      }
      
      const data = await response.json();
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userId', data.id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || (isRegistering ? 'Registration failed' : 'Login failed'));
    }
  };

  return (
    <main>
      <div className="intro section">
        <h2>Join Live Workout Sessions</h2>
        <p>Your all-in-one platform for personalized fitness training.</p>
      </div>

      <div className="login section">
        <h2>{isRegistering ? 'Create Account' : 'Login to Your Account'}</h2>
        {error && <p className="error" style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        <p style={{marginTop: '1rem', textAlign: 'center'}}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1abc9c',
              cursor: 'pointer',
              padding: '0',
              font: 'inherit',
              textDecoration: 'underline'
            }}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </main>
  );
}