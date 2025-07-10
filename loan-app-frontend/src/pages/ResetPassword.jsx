import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function ResetPassword() {
  const [formData, setFormData] = useState({ email: '', code: '', new_password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/reset-password/', formData);
      toast.success(response.data.response_description);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Reset failed');
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Reset Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
