// ✅ Frontend: Chat.jsx
import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import UserInfo from "../components/Sidebar/UserInfo";
import ContactList from "../components/Sidebar/ContactList";
import ChatPanel from "../components/ChatWindow/ChatPanel";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) return window.location.replace("/login");

    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser._id) throw new Error("User ID missing");
      setCurrentUser(parsedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!currentUser?._id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    if (socket.current) socket.current.disconnect();
    socket.current = io("http://localhost:8888", { auth: { token } });
    socket.current.on("connect", () => socket.current.emit("join"));

    const handleReceiveMessage = (msg) => {
      if (msg.receiver === currentUser._id) {
        socket.current.emit("messageDelivered", {
          messageId: msg._id,
          receiverId: currentUser._id,
        });
      }

      if (msg.sender === selectedUser?._id || msg.receiver === selectedUser?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };


    const handleTyping = ({ from, typing }) => {
      if (selectedUser && from === selectedUser._id) {
        setIsTyping(typing);
      }
    };

    socket.current.on("receiveMessage", handleReceiveMessage);
    socket.current.on("typing", handleTyping);
    socket.current.on("messageSeenConfirmation", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg._id === messageId ? { ...msg, status: "seen" } : msg))
      );
    });

    return () => {
      socket.current.off("receiveMessage", handleReceiveMessage);
      socket.current.off("typing", handleTyping);
      socket.current.off("messageSeenConfirmation");
      socket.current.disconnect();
      socket.current = null;
    };
  }, [currentUser?._id, selectedUser]);

  // ✅ Load chat history
  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedUser || !currentUser) return;

      try {
        const res = await axios.get(`http://localhost:8888/api/v1/user/conversation`, {
          params: {
            user1: currentUser._id,
            user2: selectedUser._id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("❌ Error loading conversation:", err);
      }
    };

    fetchConversation();
  }, [selectedUser?._id, selectedUser, currentUser?._id, currentUser]);




  // ✅ Emit seen
  useEffect(() => {
    if (!socket.current || !selectedUser || !messages.length || !currentUser?._id) return;
    const unseenMessages = messages.filter(
      (msg) => msg.sender === selectedUser._id && msg.receiver === currentUser._id && msg.status !== "seen"
    );
    unseenMessages.forEach((msg) => {
      socket.current.emit("messageSeen", {
        messageId: msg._id,
        receiverId: currentUser._id,
      });
    });
  }, [selectedUser, messages, currentUser?._id]);

  // ✅ Load users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currentUser?._id || !token) return;

    axios
      .get(`http://localhost:8888/api/v1/user/allusers?userId=${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const usersList = Array.isArray(res.data?.data) ? res.data.data : [];
        const filtered = usersList.filter((u) => u._id !== currentUser._id);
        setUsers(filtered);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      });
  }, [currentUser]);

  const handleSend = async (formData) => {
    const text = formData.get("content");
    const file = formData.get("usermassage");
    let fileUrl = null;

    if (file) {
      const uploadRes = await axios.post("http://localhost:8888/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fileUrl = uploadRes.data?.url;
    }

    const newMsg = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      content: text,
      isGroup: false,
      fileUrl,
    };

    socket.current.emit("message", newMsg);
  };

  if (loading || !currentUser) return null;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: "1rem" }}>
        <UserInfo user={currentUser} />
        <ContactList
          users={users}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setMessages([]); // ✅ clear old messages
          }}
          selectedUserId={selectedUser?._id}
        />
      </div>

      <ChatPanel
        selectedUser={selectedUser}
        messages={messages}
        onSend={handleSend}
        currentUserId={currentUser._id}
        isTyping={isTyping}
        onTyping={(typing) => {
          if (!selectedUser || !socket.current) return;
          socket.current.emit("typing", {
            to: selectedUser._id,
            typing,
          });
        }}
      />
    </div>
  );
}

export default Chat;
