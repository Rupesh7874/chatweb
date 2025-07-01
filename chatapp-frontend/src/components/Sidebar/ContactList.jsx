import React from 'react';

const avatarStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: 10,
  flexShrink: 0,
};

const cardBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem',
  borderRadius: '12px',
  marginBottom: '0.75rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
};

const textWrapper = {
  flex: 1,
  marginLeft: 10,
  overflow: 'hidden',
};

const deleteBtnStyle = {
  marginLeft: 10,
  background: 'transparent',
  border: 'none',
  color: '#ff4d4f',
  fontSize: '1rem',
  cursor: 'pointer',
};

function ContactList({
  users = [],
  groups = [],
  onSelectUser,
  onSelectGroup,
  selectedUserId,
  selectedGroupId,
  onDeleteUser
}) {
  return (
    <div
      style={{
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 100px)', // adjust height based on your layout
        scrollbarWidth: 'thin',
      }}
    >
      {/* Groups */}
      <h3 style={{ color: '#722ed1', marginBottom: '0.75rem' }}>📢 Groups</h3>
      {groups.length === 0 ? (
        <div style={{ color: '#999', marginBottom: '1rem' }}>No groups available</div>
      ) : (
        groups.map((group) => {
          const isSelected = group._id === selectedGroupId;
          return (
            <div
              key={group._id}
              onClick={() => onSelectGroup(group)}
              style={{
                ...cardBase,
                backgroundColor: isSelected ? '#f9f0ff' : '#fafafa',
                border: '2px solid',
                borderColor: isSelected ? '#722ed1' : 'transparent',
                boxShadow: isSelected ? '0 0 8px rgba(114, 46, 209, 0.2)' : 'none',
              }}
            >
              <div style={avatarStyle}>
                {group.groupname.charAt(0).toUpperCase()}
              </div>
              <div style={textWrapper}>
                <strong style={{ color: '#222' }}>{group.groupname}</strong><br />
                <small style={{ color: '#888' }}>Group Chat</small>
              </div>
            </div>
          );
        })
      )}

      {/* Users */}
      <h3 style={{ color: '#1890ff', margin: '1.5rem 0 0.75rem' }}>👥 Contacts</h3>
      {users.length === 0 ? (
        <div style={{ color: '#999' }}>No users available</div>
      ) : (
        users.map((user) => {
          const isSelected = user._id === selectedUserId;
          return (
            <div
              key={user._id}
              style={{
                ...cardBase,
                backgroundColor: isSelected ? '#e6f7ff' : '#fafafa',
                border: '2px solid',
                borderColor: isSelected ? '#1890ff' : 'transparent',
                boxShadow: isSelected ? '0 0 8px rgba(24, 144, 255, 0.2)' : 'none',
              }}
            >
              <div
                onClick={() => onSelectUser(user)}
                style={{ display: 'flex', alignItems: 'center', flex: 1 }}
              >
                <div style={avatarStyle}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={textWrapper}>
                  <strong style={{ color: '#222' }}>{user.name}</strong><br />
                  <small style={{ color: '#888' }}>{user.email}</small>
                </div>
              </div>
              {onDeleteUser && (
                <button
                  onClick={() => onDeleteUser(user._id)}
                  title="Delete user"
                  style={deleteBtnStyle}
                >
                  🗑️
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ContactList;
