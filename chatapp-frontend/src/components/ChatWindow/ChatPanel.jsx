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
  isTyping
}) {
  const activeChat = selectedUser || selectedGroup;

  if (!activeChat) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Select a contact to start chatting</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <ChatHeader selectedUser={selectedUser} selectedGroup={selectedGroup} />
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
        />

        {/* Typing indicator */}
        {/* Typing indicator */}
        {isTyping && (
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
            {selectedUser
              ? `${selectedUser.name} is typing...`
              : selectedGroup
                ? `someone is typing in ${selectedGroup.groupname}...`
                : null}
          </div>
        )}

      </div>

      {/* Input Box */}
      <div style={{ flexShrink: 0 }}>
        <MessageInput onSend={onSend} onTyping={onTyping} />
      </div>
    </div>
  );
}

export default ChatPanel;
