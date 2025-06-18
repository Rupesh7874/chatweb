import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserInfo from '../components/Sidebar/UserInfo';
import ContactList from '../components/Sidebar/ContactList';
import ChatPanel from '../components/ChatWindow/ChatPanel';

function Chat() {
  const currentUserId = '684ba6310ce91050aff69459';
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); 

  // Load contacts from backend
  useEffect(() => {
  const token = localStorage.getItem("token"); // Assuming you stored JWT token here

  axios.get(`http://localhost:8888/api/v1/user/allusers?userId=${currentUserId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((res) => setUsers(res.data))
  .catch((err) => console.error("Failed to load users:", err));
}, []);


  const handleSend = (text) => {
    const newMsg = {
      senderId: currentUserId,
      receiverId: selectedUser?._id,
      text,
      createdAt: new Date()
    };
    setMessages([...messages, newMsg]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <UserInfo user={{ name: "Demo User", email: "demo@example.com" }} />
        <ContactList users={users} onSelectUser={setSelectedUser} />
      </div>

      <ChatPanel
        selectedUser={selectedUser}
        messages={messages}
        onSend={handleSend}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default Chat;
