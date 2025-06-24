import React from 'react';

function MessageList({ messages, currentUserId }) {
  return (
    <div style={{ padding: '1rem' }}>
      {messages.map((msg, index) => {
        const isSender = msg.sender === currentUserId || msg.senderId === currentUserId;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isSender ? 'flex-end' : 'flex-start',
              marginBottom: '1rem',
            }}
          >
            {msg.content && (
              <div
                style={{
                  backgroundColor: isSender ? '#DCF8C6' : '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  maxWidth: '60%',
                  wordBreak: 'break-word',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {msg.content}
              </div>
            )}

            {msg.fileUrl && (
              <img
                src={`http://localhost:8888${msg.fileUrl}`}
                alt="attachment"
                style={{
                  maxWidth: '200px',
                  borderRadius: '8px',
                  marginTop: msg.content ? '8px' : 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
