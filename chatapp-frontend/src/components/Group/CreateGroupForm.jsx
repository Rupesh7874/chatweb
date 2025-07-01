// CreateGroupForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateGroupForm = ({ currentUser, onGroupCreated }) => {
  const [groupname, setGroupname] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('http://localhost:8888/api/v1/user/contacts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setContacts(res.data.contacts || []);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
        alert('Failed to load contacts');
      }
    };

    fetchContacts();
  }, []);

  const toggleUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupname.trim() || selectedUsers.length === 0) {
      return alert("Group name and at least one member are required");
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:8888/api/v1/user/creategroup',
        {
          groupname,
          selectedUserIds: selectedUsers,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      alert("✅ Group created successfully!");
      setGroupname('');
      setSelectedUsers([]);

      if (onGroupCreated) onGroupCreated();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '1rem auto'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>➕ Create New Group</h3>

      <input
        type="text"
        placeholder="Enter group name"
        value={groupname}
        onChange={(e) => setGroupname(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          fontSize: '1rem'
        }}
      />

      <h4 style={{ marginBottom: '0.5rem' }}>👥 Select Members</h4>
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #eee',
        padding: '0.5rem',
        borderRadius: '6px',
        backgroundColor: '#f9f9f9',
        marginBottom: '1rem'
      }}>
        {contacts.length === 0 && <p style={{ margin: 0 }}>No contacts found.</p>}
        {contacts.map(user => (
          <label
            key={user._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}
          >
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => toggleUser(user._id)}
              style={{ marginRight: '0.5rem' }}
            />
            {user.name} <span style={{ color: '#888', marginLeft: '0.4rem' }}>({user.email})</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: loading ? '#999' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        {loading ? 'Creating Group...' : 'Create Group'}
      </button>
    </div>
  );
};

export default CreateGroupForm;
