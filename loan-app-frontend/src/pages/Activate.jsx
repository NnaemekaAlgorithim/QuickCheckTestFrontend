import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function Activate() {
  const [formData, setFormData] = useState({ email: '', code: '', resend_code: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.name === 'resend_code' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/activate/', formData);
      if (formData.resend_code) {
        toast.success(response.data.response_description);
      } else {
        const { access_token, user } = response.data.response_data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('is_superuser', user.is_superuser);
        localStorage.setItem('email', user.email);
        toast.success(response.data.response_description);
        navigate(user.is_superuser ? '/admin' : '/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Activation failed');
    }
  };

  return (
    <div className="container">
      <h2>Activate Account</h2>
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
          <label>Activation Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="resend_code"
              checked={formData.resend_code}
              onChange={handleChange}
            />
            Resend Code
          </label>
        </div>
        <button type="submit">Activate</button>
      </form>
    </div>
  );
}
