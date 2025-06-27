import React from 'react';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: '1rem',
};

const avatarStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
  color: '#fff',
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '1rem',
  flexShrink: 0,
};

const infoStyle = {
  display: 'flex',
  flexDirection: 'column',
};

function UserInfo({ user }) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
    : 'G';

  return (
    <div style={containerStyle}>
      {/* Avatar (initials) */}
      <div style={avatarStyle}>
        {initials}
      </div>

      {/* Name & Email */}
      <div style={infoStyle}>
        <strong style={{ fontSize: '1.1rem' }}>{user?.name || 'Guest'}</strong>
        <span style={{ color: '#888' }}>{user?.email || 'Not logged in'}</span>
      </div>
    </div>
  );
}

export default UserInfo;
