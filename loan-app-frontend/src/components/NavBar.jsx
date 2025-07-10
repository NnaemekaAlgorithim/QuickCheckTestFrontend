import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [isSuperuser, setIsSuperuser] = useState(localStorage.getItem('is_superuser') === 'true');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
    setIsSuperuser(localStorage.getItem('is_superuser') === 'true');
    setEmail(localStorage.getItem('email') || '');
  }, []);

  return (
    <nav>
      <div className="container">
        <Link to="/">Loan App</Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">My Loans</Link>
              {isSuperuser && <Link to="/admin">Admin</Link>}
              <Link to="/profile">Profile</Link>
              <span>{email}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
