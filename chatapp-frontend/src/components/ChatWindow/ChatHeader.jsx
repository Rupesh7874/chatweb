import React from 'react';

function ChatHeader({ selectedUser, selectedGroup }) {
  const name = selectedUser?.name || selectedGroup?.groupname || 'Select a chat';
  const emailOrDesc = selectedUser?.email || selectedGroup?.description || '';

  const initials = name
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          marginRight: '1rem',
        }}
      >
        {initials}
      </div>

      <div>
        <strong style={{ fontSize: '1.1rem' }}>{name}</strong>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>{emailOrDesc}</p>
      </div>
    </div>
  );
}

export default ChatHeader;
