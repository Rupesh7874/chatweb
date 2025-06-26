import React, { useEffect, useRef } from 'react';

function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
  }, [messages]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '1rem' }}>
      {messages.map((msg, index) => {
        const senderId = msg.sender && typeof msg.sender === 'object'
          ? String(msg.sender._id)
          : String(msg.sender);

        const isSender = senderId === String(currentUserId);
        const time = msg.timestamp || msg.createdAt || '';
        const senderName =
          !isSender && typeof msg.sender === 'object'
            ? msg.sender.name
            : '';

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
                backgroundColor: isSender ? '#DCF8C6' : '#F1F0F0',
                padding: '10px 14px',
                borderRadius: '10px',
                maxWidth: '60%',
                wordBreak: 'break-word',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              {/* Sender Name (for received group messages) */}
              {senderName && (
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  {senderName}
                </div>
              )}

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

              {/* Timestamp & Status */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: '#777',
                  marginTop: '4px',
                }}
              >
                <span>{time ? formatTime(time) : ''}</span>

                {isSender && (
                  <span style={{ marginLeft: '8px' }}>
                    {msg.status === 'seen' ? (
                      <span style={{ color: '#4fc3f7' }}>✔✔</span>
                    ) : msg.status === 'delivered' ? (
                      <span style={{ color: '#9e9e9e' }}>✔✔</span>
                    ) : (
                      <span style={{ color: '#9e9e9e' }}>✔</span>
                    )}
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
