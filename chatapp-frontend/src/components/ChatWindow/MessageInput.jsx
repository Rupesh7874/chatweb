import React, { useState } from 'react';

function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text); // send message to parent
    setText('');  // clear input
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #ccc' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: '0.5rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}
      />
      <button type="submit" style={{
        marginLeft: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px'
      }}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;
