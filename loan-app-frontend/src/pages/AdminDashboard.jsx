import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchLoans = async () => {
    try {
      const response = await api.get('admin/loans/');
      setLoans(response.data.response_data.results || []);
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Failed to fetch loans');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('admin/users/');
      setUsers(response.data.response_data.results || []);
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Failed to fetch users');
    }
  };

  const handleStatusChange = async (loanId, status) => {
    try {
      const response = await api.patch(`admin/loans/${loanId}/update/`, { status });
      toast.success(response.data.response_description || 'Loan updated successfully');
      fetchLoans();
    } catch (error) {
      toast.error(error.response?.data?.response_description || 'Failed to update loan');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`admin/users/${userId}/delete/`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.response_description || 'Failed to delete user');
      }
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <h3>Loans</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User Email</th>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.user.email}</td>
              <td>{loan.amount_requested}</td>
              <td>{loan.purpose}</td>
              <td>{loan.status}</td>
              <td>
                <select
                  value={loan.status}
                  onChange={(e) => handleStatusChange(loan.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="flagged">Flagged</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>{user.role}</td>
              <td>
                <button className="danger" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
