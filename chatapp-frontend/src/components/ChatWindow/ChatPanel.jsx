import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatPanel({
  selectedUser,
  selectedGroup,
  messages,
  onSend,
  currentUserId,
  onTyping,
  isTyping,
}) {
  const activeChat = selectedUser || selectedGroup;

  if (!activeChat) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f2f5',
          borderRadius: '12px',
          margin: '1rem',
        }}
      >
        <h2 style={{ color: '#555' }}>Select a contact or group to start chatting</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '95%',
        backgroundColor: '#fff',
        borderRadius: '12px',
        margin: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <ChatHeader selectedUser={selectedUser} selectedGroup={selectedGroup} />
      </div>

      {/* Message List */}
      {/* Message List Wrapper */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
          }}
        >
          <MessageList
            messages={messages}
            currentUserId={currentUserId}
            selectedUser={selectedUser}
            selectedGroup={selectedGroup}
          />

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
              {selectedUser
                ? `${selectedUser.name} is typing...`
                : selectedGroup
                  ? `Someone is typing in ${selectedGroup.groupname}...`
                  : null}
            </div>
          )}
        </div>
      </div>


      {/* Input Box */}
      <div style={{ flexShrink: 0, padding: '0.75rem', borderTop: '1px solid #eee' }}>
        <MessageInput onSend={onSend} onTyping={onTyping} />
      </div>
    </div>
  );
}

export default ChatPanel;
