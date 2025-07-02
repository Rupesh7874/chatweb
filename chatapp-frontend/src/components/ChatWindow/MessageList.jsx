import React, { useEffect, useRef, useState } from 'react';

function MessageList({ messages, currentUserId, onDelete, onUpdate }) {
  const bottomRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.message-menu') &&
        !e.target.closest('.edit-box')
      ) {
        setOpenMenuId(null);
        setEditingMessageId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '1rem' }}>
      {messages.map((msg, index) => {
        const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
        const isSender = senderId === currentUserId;
        const time = msg.timestamp || msg.createdAt || '';
        const senderName = !isSender && typeof msg.sender === 'object' ? msg.sender.name : '';
        const isEditing = editingMessageId === msg._id;

        return (
          <div
            key={msg._id || index}
            style={{
              position: 'relative',
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
              {senderName && (
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  {senderName}
                </div>
              )}

              {isEditing ? (
                <div className="edit-box" style={{ marginTop: '4px' }}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                    }}
                  />
                  <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingMessageId(null);
                        setEditText('');
                      }}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#eee',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editText.trim()) {
                          onUpdate(msg._id, editText.trim());
                          setEditingMessageId(null);
                          setEditText('');
                        }
                      }}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {msg.content && <div>{msg.content}</div>}

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

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#777',
                      marginTop: '4px',
                    }}
                  >
                    <span>{formatTime(time)}</span>
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
                </>
              )}

              {isSender && !isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === msg._id ? null : msg._id);
                  }}
                  className="message-menu"
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '0px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#666',
                    lineHeight: '1',
                  }}
                  title="More"
                >
                  &#8942;
                </button>
              )}

              {isSender && openMenuId === msg._id && (
                <div
                  className="message-menu"
                  style={{
                    position: 'absolute',
                    top: '28px',
                    right: '4px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '100px',
                  }}
                >
                  <div
                    onClick={() => {
                      onDelete(msg._id);
                      setOpenMenuId(null);
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#f44336',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    Delete
                  </div>
                  {!msg.fileUrl && (
                    <div
                      onClick={() => {
                        setEditText(msg.content || '');
                        setEditingMessageId(msg._id);
                        setOpenMenuId(null);
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: '#333',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
