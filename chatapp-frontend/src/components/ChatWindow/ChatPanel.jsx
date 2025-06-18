import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatPanel({ selectedUser, messages, onSend, currentUserId }) {
  if (!selectedUser) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Select a contact to start chatting</h2>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ChatHeader selectedUser={selectedUser} />
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default ChatPanel;
