// components/Sidebar/GroupList.jsx
function GroupList({ groups, onSelectGroup, selectedGroupId }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem' }}>Your Groups</h3>
      <ul>
        {groups.map((group) => (
          <li
            key={group._id}
            style={{
              padding: '8px',
              backgroundColor: selectedGroupId === group._id ? '#eee' : '#fff',
              cursor: 'pointer',
            }}
            onClick={() => onSelectGroup(group)}
          >
            {group.groupname}
          </li>
        ))}
      </ul>
    </div>
  );
}
