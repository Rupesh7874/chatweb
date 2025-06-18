import React from 'react';

function UserInfo({ user }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3>{user?.name || 'Guest'}</h3>
      <p>{user?.email || 'Not logged in'}</p>
    </div>
  );
}

export default UserInfo;
