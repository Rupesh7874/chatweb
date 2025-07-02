// Chat.jsx — Updated with message update (edit) support
import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import UserInfo from "../components/Sidebar/UserInfo";
import ContactList from "../components/Sidebar/ContactList";
import ChatPanel from "../components/ChatWindow/ChatPanel";
import LogoutButton from "../components/Sidebar/LogoutButton";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const socket = useRef(null);
  const selectedUserRef = useRef(null);
  const selectedGroupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);
  useEffect(() => { selectedGroupRef.current = selectedGroup; }, [selectedGroup]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) return window.location.replace("/login");

    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser._id) throw new Error("Invalid user");
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

    socket.current.on("connect", () => {
      socket.current.emit("join");
    });

    socket.current.on("receiveMessage", (msg) => {
      const target = msg.isGroup ? selectedGroupRef.current?._id : selectedUserRef.current?._id;
      if ((msg.receiver === target || msg.sender === target)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.current.on("typing", ({ from, typing, isGroup, to }) => {
      if (!isGroup && from === selectedUserRef.current?._id) {
        setIsTyping(typing);
      } else if (isGroup && to === selectedGroupRef.current?._id) {
        const user = users.find((u) => u._id === from);
        setIsTyping(typing ? { name: user?.name || "Someone" } : null);
      }
    });

    socket.current.on("messageSeenConfirmation", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status: "seen" } : msg))
      );
    });

    socket.current.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.current.on("messageUpdated", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    });

    return () => {
      socket.current.disconnect();
      socket.current = null;
    };
  }, [currentUser?._id, users]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currentUser?._id || !token) return;

    axios
      .get(`http://localhost:8888/api/v1/user/allusers?userId=${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const list = res.data?.data || [];
        setUsers(list.filter((u) => u._id !== currentUser._id));
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?._id) return;

    axios
      .get("http://localhost:8888/api/v1/group/joined", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setGroups(res.data?.groups || []))
      .catch((err) => console.error("❌ Group fetch error:", err));
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    axios
      .get("http://localhost:8888/api/v1/user/conversation", {
        params: {
          user1: currentUser._id,
          user2: selectedUser._id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMessages(res.data?.data || []))
      .catch((err) => console.error("❌ Conversation error:", err));
  }, [selectedUser?._id, currentUser?._id]);

  useEffect(() => {
    if (!selectedGroup || !currentUser) return;

    axios
      .get(`http://localhost:8888/api/v1/group/messages/${selectedGroup._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMessages(res.data?.data || []))
      .catch((err) => console.error("❌ Group message error:", err));
  }, [selectedGroup?._id, currentUser?._id]);

  useEffect(() => {
    if (!socket.current || !selectedUser || !messages.length || !currentUser?._id) return;

    const unseen = messages.filter(
      (msg) =>
        msg.sender === selectedUser._id &&
        msg.receiver === currentUser._id &&
        msg.status !== "seen"
    );

    unseen.forEach((msg) => {
      socket.current.emit("messageSeen", {
        messageId: msg._id,
        receiverId: currentUser._id,
      });
    });
  }, [selectedUser, messages]);

  useEffect(() => {
    if (!socket.current || !selectedGroup || !messages.length || !currentUser?._id) return;

    const timer = setTimeout(() => {
      const unseen = messages.filter(
        (msg) => msg.sender !== currentUser._id && msg.status !== "seen"
      );
      unseen.forEach((msg) => {
        socket.current.emit("messageSeen", {
          messageId: msg._id,
          receiverId: currentUser._id,
        });
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedGroup, messages]);

  const handleSend = async (formData) => {
    const text = formData.get("content");
    const file = formData.get("usermassage");
    let fileUrl = null;

    if (file) {
      const uploadRes = await axios.post(
        "http://localhost:8888/api/v1/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fileUrl = uploadRes.data?.url;
    }

    const newMsg = {
      senderId: currentUser._id,
      receiverId: selectedGroup ? selectedGroup._id : selectedUser._id,
      content: text,
      isGroup: !!selectedGroup,
      fileUrl,
    };

    socket.current.emit("message", newMsg);
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  const handleUpdateMessage = async (messageId, updatedText) => {
    try {
      socket.current.emit("updateMessage", {
        messageId,
        content: updatedText,
      });
    } catch (err) {
      alert("❌ Failed to update message");
      console.error(err);
    }
  };


  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:8888/api/v1/user/deletegroup/${groupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      if (selectedGroup?._id === groupId) {
        setSelectedGroup(null);
        setMessages([]);
      }
    } catch (err) {
      alert("❌ Failed to delete group");
    }
  };
  //update user
  const handleUpdateUser = async (userId) => {
    if (!window.confirm("update this user?")) return;
    try {
      await axios.delete(`http://localhost:8888/api/v1/user/userdelete?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      alert("❌ Failed to delete user");
    }
  }

  //Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8888/api/v1/user/userdelete?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      alert("❌ Failed to delete user");
    }
  };

  if (loading || !currentUser) return null;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "25%", height: "100%", borderRight: "1px solid #ccc", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
          <UserInfo user={currentUser} />
          <LogoutButton />
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <button
            onClick={() => navigate("/groups")}
            style={{
              width: "90%",
              margin: "1rem auto",
              padding: "0.5rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "block",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            ➕ Create Group
          </button>

          <ContactList
            users={users}
            groups={groups}
            selectedUserId={selectedUser?._id}
            selectedGroupId={selectedGroup?._id}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
            onDeleteGroup={handleDeleteGroup}
            onSelectUser={(user) => {
              setSelectedUser(user);
              setSelectedGroup(null);
              setMessages([]);
            }}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setSelectedUser(null);
              setMessages([]);
              socket.current.emit("joinGroup", group._id);
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
        <ChatPanel
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          messages={messages}
          onDelete={handleDeleteMessage}
          onUpdate={handleUpdateMessage}
          setMessages={setMessages}
          onSend={handleSend}
          currentUserId={currentUser._id}
          isTyping={isTyping}
          onTyping={(typing) => {
            if (!socket.current) return;
            if (selectedUser) {
              socket.current.emit("typing", {
                to: selectedUser._id,
                typing,
                isGroup: false,
              });
            } else if (selectedGroup) {
              socket.current.emit("typing", {
                to: selectedGroup._id,
                typing,
                isGroup: true,
              });
            }
          }}
        />
      </div>
    </div>
  );
}

export default Chat;
