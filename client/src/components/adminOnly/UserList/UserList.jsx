import React, { useState, useEffect } from 'react';
import axiosInstance from '../../AxiosInstance';
import styles from './UserList.module.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', user_type: '', is_admin: false });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        const sortedUsers = response.data.users.sort((a, b) => {
          const rolesOrder = ['waiter', 'bartender', 'shift manager'];
          return rolesOrder.indexOf(a.user_type) - rolesOrder.indexOf(b.user_type);
        });
        setUsers(sortedUsers);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user.id);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      is_admin: user.is_admin,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/admin/users/edit/${editUser}`, formData);
      setEditUser(null);
      const response = await axiosInstance.get('/admin/users');
      const sortedUsers = response.data.users.sort((a, b) => {
        const rolesOrder = ['waiter', 'bartender', 'shift manager'];
        return rolesOrder.indexOf(a.user_type) - rolesOrder.indexOf(b.user_type);
      });
      setUsers(sortedUsers);
    } catch (err) {
      setError('Failed to edit user');
    }
  };

  const handleDeleteClick = async (user_id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/admin/users/delete/${user_id}`);
        const response = await axiosInstance.get('/admin/users');
        const sortedUsers = response.data.users.sort((a, b) => {
          const rolesOrder = ['waiter', 'bartender', 'shift manager'];
          return rolesOrder.indexOf(a.user_type) - rolesOrder.indexOf(b.user_type);
        });
        setUsers(sortedUsers);
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className={styles.userListContainer}>
      <h2>Users List</h2>
      {error && <p className={styles.error}>{error}</p>}
      {editUser ? (
        <form onSubmit={handleEditSubmit}>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label>User Type:</label>
            <select
              value={formData.user_type}
              onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
            >
              <option value="">Select user type</option>
              <option value="waiter">Waiter</option>
              <option value="bartender">Bartender</option>
              <option value="shift manager">Shift Manager</option>
            </select>
          </div>
          <div>
            <label>Is Admin:</label>
            <input
              type="checkbox"
              checked={formData.is_admin}
              onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
        </form>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Is Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.user_type}</td>
                <td>{user.is_admin ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => handleDeleteClick(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
