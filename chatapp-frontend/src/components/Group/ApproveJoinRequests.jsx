// ApproveJoinRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveJoinRequests = ({ groupid }) => {
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:8888/api/group/${groupid}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

        setJoinRequests(res.data.group?.joinRequests || []);
      } catch (err) {
        console.error('Error loading requests', err);
      }
    };

    fetchRequests();
  }, [groupid]);

  const approveUser = async (userid) => {
    try {
      const res = await axios.post(`http://localhost:8888/api/group/approve`, {
        groupid,
        userid
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      alert(res.data.message);
      setJoinRequests(prev => prev.filter(id => id !== userid));
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  return (
    <div>
      <h3>Join Requests</h3>
      <ul>
        {joinRequests.map((userid) => (
          <li key={userid}>
            {userid}
            <button onClick={() => approveUser(userid)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApproveJoinRequests;
