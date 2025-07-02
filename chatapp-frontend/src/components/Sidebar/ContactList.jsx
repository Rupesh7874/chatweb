import React, { useState, useEffect, useRef } from 'react';

const avatarStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: 10,
  flexShrink: 0,
};

const cardBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem',
  borderRadius: '12px',
  marginBottom: '0.75rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
};

const textWrapper = {
  flex: 1,
  marginLeft: 10,
  overflow: 'hidden',
};

const menuBtn = {
  marginLeft: 10,
  background: 'transparent',
  border: 'none',
  color: '#333',
  fontSize: '1.2rem',
  cursor: 'pointer',
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '100%',
  right: 10,
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: 6,
  zIndex: 100,
  width: 120,
};

const menuItemStyle = {
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  color: '#333',
  borderBottom: '1px solid #eee',
};

function ContactList({
  users = [],
  groups = [],
  onSelectUser,
  onSelectGroup,
  selectedUserId,
  selectedGroupId,
  onDeleteUser,
  onUpdateUser,
  onDeleteGroup, // ✅ New prop
}) {
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const [openMenuGroupId, setOpenMenuGroupId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuUserId(null);
        setOpenMenuGroupId(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenuUser = (e, userId) => {
    e.stopPropagation();
    setOpenMenuUserId(prev => (prev === userId ? null : userId));
  };

  const toggleMenuGroup = (e, groupId) => {
    e.stopPropagation();
    setOpenMenuGroupId(prev => (prev === groupId ? null : groupId));
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      onDeleteGroup(groupId);
    }
    setOpenMenuGroupId(null);
  };

  const handleUpdateUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onUpdateUser(userId);
    }
    setOpenMenuUserId(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDeleteUser(userId);
    }
    setOpenMenuUserId(null);
  };

  return (
    <div
      style={{
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 100px)',
        scrollbarWidth: 'thin',
      }}
    >
      {/* Groups */}
      <h3 style={{ color: '#722ed1', marginBottom: '0.75rem' }}>📢 Groups</h3>
      {groups.length === 0 ? (
        <div style={{ color: '#999', marginBottom: '1rem' }}>No groups available</div>
      ) : (
        groups.map((group) => {
          const isSelected = group._id === selectedGroupId;
          return (
            <div
              key={group._id}
              onClick={() => onSelectGroup(group)}
              style={{
                ...cardBase,
                backgroundColor: isSelected ? '#f9f0ff' : '#fafafa',
                border: '2px solid',
                borderColor: isSelected ? '#722ed1' : 'transparent',
                boxShadow: isSelected ? '0 0 8px rgba(114, 46, 209, 0.2)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={avatarStyle}>
                  {group.groupname.charAt(0).toUpperCase()}
                </div>
                <div style={textWrapper}>
                  <strong style={{ color: '#222' }}>{group.groupname}</strong>
                  <br />
                  <small style={{ color: '#888' }}>Group Chat</small>
                </div>
              </div>

              <button
                onClick={(e) => toggleMenuGroup(e, group._id)}
                style={menuBtn}
                title="Options"
              >
                ⋮
              </button>

              {openMenuGroupId === group._id && (
                <div ref={menuRef} style={dropdownMenuStyle}>
                  <div
                    style={{ ...menuItemStyle, color: '#ff4d4f', borderBottom: 'none' }}
                    onClick={() => handleDeleteGroup(group._id)}
                  >
                     Delete
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Users */}
      <h3 style={{ color: '#1890ff', margin: '1.5rem 0 0.75rem' }}>👥 Contacts</h3>
      {users.length === 0 ? (
        <div style={{ color: '#999' }}>No users available</div>
      ) : (
        users.map((user) => {
          const isSelected = user._id === selectedUserId;
          return (
            <div
              key={user._id}
              style={{
                ...cardBase,
                backgroundColor: isSelected ? '#e6f7ff' : '#fafafa',
                border: '2px solid',
                borderColor: isSelected ? '#1890ff' : 'transparent',
                boxShadow: isSelected ? '0 0 8px rgba(24, 144, 255, 0.2)' : 'none',
              }}
            >
              <div
                onClick={() => onSelectUser(user)}
                style={{ display: 'flex', alignItems: 'center', flex: 1 }}
              >
                <div style={avatarStyle}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={textWrapper}>
                  <strong style={{ color: '#222' }}>{user.name}</strong>
                  <br />
                  <small style={{ color: '#888' }}>{user.email}</small>
                </div>
              </div>

              <button
                onClick={(e) => toggleMenuUser(e, user._id)}
                style={menuBtn}
                title="Options"
              >
                ⋮
              </button>

              {openMenuUserId === user._id && (
                <div ref={menuRef} style={dropdownMenuStyle}>
                  <div
                    style={menuItemStyle}
                    onClick={() => handleUpdateUser(user._id)}
                  >
                    ✏️ Update
                  </div>
                  <div
                    style={{ ...menuItemStyle, borderBottom: 'none', color: '#ff4d4f' }}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    🗑️ Delete
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ContactList;
