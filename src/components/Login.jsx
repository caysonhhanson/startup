import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
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
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Auth error:', err);
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
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={isRegistering ? "Choose a password (min 6 characters)" : "Enter your password"}
            />
          </div>
          
          {isRegistering && (
            <div style={{fontSize: '0.9em', color: '#666', marginBottom: '1rem'}}>
              Password must be at least 6 characters long
            </div>
          )}
          
          <button type="submit">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={{marginTop: '1rem'}}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={{
              marginLeft: '0.5rem',
              color: '#1abc9c',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </main>
  );
}