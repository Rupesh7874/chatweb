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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <ChatHeader selectedUser={selectedUser} />
      </div>

      {/* Scrollable messages area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          selectedUser={selectedUser}
        />
      </div>

      {/* Input fixed at bottom */}
      <div style={{ flexShrink: 0 }}>
        <MessageInput onSend={onSend} />
      </div>
    </div>
  );
}

export default ChatPanel;
