import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({ amount_requested: '', purpose: '' });
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLoans = async () => {
    try {
      const response = await api.get(`loans/${statusFilter ? `?status=${statusFilter}` : ''}`);
      setLoans(response.data.response_data.results || []);
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Failed to fetch loans');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('loans/', {
        ...formData,
        amount_requested: parseFloat(formData.amount_requested),
      });
      toast.success(response.data.response_description);
      setFormData({ amount_requested: '', purpose: '' });
      fetchLoans();
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Loan application failed');
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  return (
    <div className="container">
      <h2>My Loans</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount (NGN)</label>
          <input
            type="number"
            name="amount_requested"
            value={formData.amount_requested}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Purpose</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Apply for Loan</button>
      </form>
      <div>
        <label>Filter by Status</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.amount_requested}</td>
              <td>{loan.purpose}</td>
              <td>{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
