import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminGroupsPanel = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroupNotifications = async () => {
      const res = await axios.get('http://localhost:8888/api/group/admin/groups/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setGroups(res.data.groups);
    };

    fetchGroupNotifications();
  }, []);

  return (
    <div>
      <h3>Your Groups</h3>
      {groups.map(group => (
        <div key={group.groupId}>
          {group.groupname}
          {group.pendingRequests > 0 && (
            <span style={{ color: 'red', marginLeft: 8 }}>
              🔔 {group.pendingRequests}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminGroupsPanel;
