import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({ email_or_username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/login/', formData);
      const { access_token, user } = response.data.response_data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('is_superuser', user.is_superuser);
      localStorage.setItem('email', user.email);
      toast.success(response.data.response_description);
      navigate(user.is_superuser ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username</label>
          <input
            type="text"
            name="email_or_username"
            value={formData.email_or_username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <a href="/forgot-password">Forgot Password?</a>
      </form>
    </div>
  );
}
