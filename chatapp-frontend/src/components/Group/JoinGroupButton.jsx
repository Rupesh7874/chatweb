// JoinGroupButton.jsx
import React from 'react';
import axios from 'axios';

const JoinGroupButton = ({ groupid }) => {
  const handleJoin = async () => {
    try {
      const res = await axios.post('http://localhost:8888/api/group/join', {
        groupid,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Join request failed');
    }
  };

  return <button onClick={handleJoin}>Request to Join</button>;
};

export default JoinGroupButton;
