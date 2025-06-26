function GroupList({ groups = [], onSelectGroup, selectedGroupId }) {
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
                backgroundColor: isSelected ? '#e6ffe6' : 'transparent',
                borderBottom: '1px solid #ddd',
                borderRadius: '5px',
                marginBottom: '4px',
              }}
            >
              <strong>{group.name}</strong>
              <br />
              <small>{group.description}</small>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GroupList;
