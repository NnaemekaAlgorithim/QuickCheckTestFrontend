import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function Profile() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', password: '' });
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await api.get('profile/');
      const { first_name, last_name } = response.data.response_data;
      setFormData({ first_name, last_name, password: '' });
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Failed to fetch profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {};
      if (formData.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name) updateData.last_name = formData.last_name;
      if (formData.password) updateData.password = formData.password;
      const response = await api.patch('profile/', updateData);
      toast.success(response.data.response_description);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        await api.delete('profile/');
        localStorage.removeItem('access_token');
        localStorage.removeItem('is_superuser');
        localStorage.removeItem('email');
        toast.success('Profile deleted successfully');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.response_description || 'Delete failed');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>New Password (optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
        <button type="button" className="danger" onClick={handleDelete}>
          Delete Profile
        </button>
      </form>
    </div>
  );
}
