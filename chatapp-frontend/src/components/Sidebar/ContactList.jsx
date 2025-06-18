function ContactList({ users, onSelectUser, selectedUserId }) {
  return (
    <div>
      <h4>Contacts</h4>
      {users.map((user) => {
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
      })}
    </div>
  );
}

export default ContactList; // ✅ This line is required
