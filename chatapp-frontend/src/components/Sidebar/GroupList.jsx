import React, { useState } from 'react';
import axios from 'axios';

function GroupList({ groups = [], onSelectGroup, selectedGroupId, onGroupDeleted }) {
  const [showMenuFor, setShowMenuFor] = useState(null);

 
  return (
    <div>
      <h4>Groups</h4>
      {groups.length === 0 ? (
        <div>No groups available</div>
      ) : (
        groups.map((group) => {
          const isSelected = group._id === selectedGroupId;
          return (
            <div
              key={group._id}
              style={{
                position: 'relative',
                padding: '0.75rem',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#e6ffe6' : 'transparent',
                borderBottom: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '4px',
              }}
            >
              <div onClick={() => onSelectGroup(group)}>
                <strong>{group.name}</strong>
                <br />
                <small>{group.description}</small>
              </div>

              {/* 3-dot menu */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuFor(showMenuFor === group._id ? null : group._id);
                }}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ⋮
              </div>

              {/* Dropdown menu */}
              {showMenuFor === group._id && (
                <div
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 30,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    zIndex: 100,
                    padding: '0.5rem',
                  }}
                >
                  <div
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => handleDelete(group._id)}
                  >
                    Delete Group
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

export default GroupList;
