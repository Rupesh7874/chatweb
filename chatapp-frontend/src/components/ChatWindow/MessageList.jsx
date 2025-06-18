import React from 'react';

function MessageList({ messages = [], currentUserId }) {
  return (
    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            textAlign: msg.senderId === currentUserId ? 'right' : 'left',
            marginBottom: '1rem'
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: msg.senderId === currentUserId ? '#dcf8c6' : '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              maxWidth: '70%'
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
