function ContactList({ users = [], groups = [], onSelectUser, onSelectGroup, selectedUserId, selectedGroupId }) {
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
              onClick={() => onSelectGroup(group)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#fff1f0' : 'transparent',
                borderBottom: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '4px',
              }}
            >
              <strong>{group.name}</strong><br />
              <small>Group</small>
            </div>
          );
        })
      )}

      <h4 style={{ marginTop: '1rem' }}>Contacts</h4>
      {users.length === 0 ? (
        <div>No users available</div>
      ) : (
        users.map((user) => {
          const isSelected = user._id === selectedUserId;
          return (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                borderBottom: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '4px',
              }}
            >
              <strong>{user.name}</strong><br />
              <small>{user.email}</small>
            </div>
          );
        })
      )}
    </div>
  );
}
export default ContactList;