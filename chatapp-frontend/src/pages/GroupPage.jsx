import React, { useEffect, useState } from 'react';
import CreateGroupForm from '../components/Group/CreateGroupForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GroupPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed);

      axios
        .get(`http://localhost:8888/api/v1/user/getUserGroups/${parsed._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          setMyGroups(res.data.groups);
        })
        .catch((err) => console.error(err));
    }
  }, []);
  

  const handleGroupCreated = () => {
    navigate('/chat');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f0f4f8, #e8f0fe)',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '2rem',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        👥 Group Management
      </h2>

      {currentUser && (
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <CreateGroupForm currentUser={currentUser} onGroupCreated={handleGroupCreated} />
        </div>
      )}

      {/* <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}> */}
        {/* <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          color: '#444',
          borderBottom: '1px solid #eee',
          paddingBottom: '0.5rem'
        }}>
          📁 My Groups
        </h3>

        {myGroups.length > 0 ? (
          <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
            {myGroups.map((group) => (
              <li key={group._id} style={{
                backgroundColor: '#f9fafc',
                padding: '0.75rem 1rem',
                marginBottom: '0.75rem',
                borderRadius: '8px',
                color: '#333',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <strong>{group.groupname}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#777' }}>No groups found. Create one now!</p>
        )}
      </div> */}
    </div>
  );
};

export default GroupPage;
