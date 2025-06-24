import React, { useEffect, useRef } from 'react';

function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
            <div
              style={{
                backgroundColor: isSender ? '#DCF8C6' : '#ffffff',
                padding: '10px 14px',
                borderRadius: '10px',
                maxWidth: '60%',
                wordBreak: 'break-word',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              {/* Message Text */}
              {msg.content && <div>{msg.content}</div>}

              {/* Image */}
              {msg.fileUrl && (
                <img
                  src={`http://localhost:8888${msg.fileUrl}`}
                  alt="sent"
                  style={{
                    maxWidth: '200px',
                    borderRadius: '8px',
                    marginTop: msg.content ? '8px' : 0,
                  }}
                />
              )}

              {/* Timestamp + Status */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: '#777',
                  marginTop: '4px',
                }}
              >
                <span>{formatTime(msg.timestamp)}</span>
                {isSender && msg.status && (
                  <span style={{ marginLeft: '8px' }}>
                    {msg.status === 'seen'
                      ? '✓✓ Seen'
                      : msg.status === 'delivered'
                      ? '✓✓ Delivered'
                      : '✓ Sent'}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
