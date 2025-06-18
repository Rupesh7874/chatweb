import React from 'react';

function ChatHeader({ selectedUser }) {
  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
      <h3>{selectedUser?.name || 'Select a user'}</h3>
      <p>{selectedUser?.email || ''}</p>
    </div>
  );
}

export default ChatHeader;
