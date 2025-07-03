import React, { useState, useRef, useEffect } from 'react';

const containerStyle = {
  position: 'relative',
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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
    : 'G';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // const handleDelete = () => {
  //   alert('Delete account clicked');
  //   // Add delete API logic here
  // };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={containerStyle} ref={dropdownRef}>
      {/* Avatar */}
      <div style={avatarStyle}>{initials}</div>

      {/* Info */}
      <div style={infoStyle}>
        <strong style={{ fontSize: '1.1rem' }}>{user?.name || 'Guest'}</strong>
        <span style={{ color: '#888' }}>{user?.email || 'Not logged in'}</span>
      </div>

      {/* Three Dots Button */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#999',
          }}
        >
          &#8942;
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div
            style={{
              position: 'absolute',
              top: '25px',
              right: 0,
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              zIndex: 100,
              minWidth: '140px',
              padding: '0.5rem 0',
            }}
          >
            <div
              onClick={handleLogout}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                color: '#ff4d4f',
                fontWeight: 'bold',
                borderBottom: '1px solid #eee',
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
