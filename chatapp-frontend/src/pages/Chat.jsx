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
  const socket = useRef(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      console.log("🔴 No token or user, redirecting...");
      window.location.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser._id) throw new Error("User ID missing");
      setCurrentUser(parsedUser);
    } catch (err) {
      console.error("❌ Invalid user data in localStorage", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
    setLoading(false);
  }, []);

  // ✅ Connect socket only once
  useEffect(() => {
    if (!currentUser?._id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    if (socket.current) {
      socket.current.disconnect(); // 🔁 clear old socket before making new one
    }

    socket.current = io("http://localhost:8888", {
      auth: { token },
    });

    const handleReceiveMessage = (msg) => {
      console.log("📩 New message received:", msg);

      // Emit delivered status to server
      socket.current.emit("messageDelivered", {
        messageId: msg._id,
        receiverId: currentUser._id,
      });

      if (msg.sender === selectedUser?._id || msg.receiver === selectedUser?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };


    socket.current.on("connect", () => {
      // console.log("✅ Socket connected:", socket.current.id);
      socket.current.emit("join");
    });

    // 👇 Important: remove previous listener before attaching new
    socket.current.off("receiveMessage");
    socket.current.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.current?.off("receiveMessage", handleReceiveMessage);
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [currentUser?._id, selectedUser?._id]); // 👈 includes selectedUser too

  // ✅ Load contacts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currentUser?._id || !token) return;

    axios
      .get(`http://localhost:8888/api/v1/user/allusers?userId=${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const usersList = Array.isArray(res.data?.data) ? res.data.data : [];
        const filtered = usersList.filter((u) => u._id !== currentUser._id);
        setUsers(filtered);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      });
  }, [currentUser]);

  // ✅ Send message (only emit, no local setMessages)
  const handleSend = async (formData) => {
    const text = formData.get("content");
    const file = formData.get("usermassage");
    // console.log("message 1",text);
    // console.log("message 1",file);

    let fileUrl = null;

    // ✅ Upload image if available
    if (file) {
      const uploadRes = await axios.post("http://localhost:8888/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fileUrl = uploadRes.data?.url;
      // console.log("message2",fileUrl);

    }

    // ✅ Emit message
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
        <ContactList users={users} onSelectUser={(user) => {
          setSelectedUser(user);
          // setMessages([]); // reset messages when changing contact
        }}
          selectedUserId={selectedUser?._id}
        />
      </div>

      <ChatPanel
        selectedUser={selectedUser}
        messages={messages}
        onSend={handleSend}
        currentUserId={currentUser._id}
      />
    </div>
  );
}

export default Chat;
