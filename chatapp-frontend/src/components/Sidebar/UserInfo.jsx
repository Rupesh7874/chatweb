import React from 'react';

function UserInfo({ user }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3>{user?.name || 'Guest'}</h3>
      <p>{user?.email || 'Not logged in'}</p>
       {/* <img
        src={user?.profileimage ? `http://localhost:8888/${user.profileimage}` : '/default-profile.png'}
        alt="Profile"
        style={{ width: '70px', height: '70px', borderRadius: '50%' }}
      /> */}
    </div>
  );
}

export default UserInfo;
