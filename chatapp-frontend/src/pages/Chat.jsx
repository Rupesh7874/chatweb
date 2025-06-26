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
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef(null);

  const selectedUserRef = useRef(null);
  const selectedGroupRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

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

    socket.current.on("connect", () => {
      socket.current.emit("join");
    });

    const handleReceiveMessage = (msg) => {
      if (msg.isGroup) {
        if (msg.receiver === selectedGroupRef.current?._id) {
          setMessages((prev) => [...prev, msg]);
        } else {
          console.log("❌ Group mismatch — message ignored");
        }
      } else {
        const selected = selectedUserRef.current;
        if (
          selected &&
          (msg.sender === selected._id || msg.receiver === selected._id)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    const handleTyping = ({ from, typing, isGroup, to }) => {
      if (!isGroup) {
        const selected = selectedUserRef.current;
        if (selected && from === selected._id) {
          setIsTyping(typing);
        }
      } else {
        const selectedGroup = selectedGroupRef.current;
        if (selectedGroup && to === selectedGroup._id) {
          // ✅ Get typing user data
          const typingUser = users.find(u => u._id === from);
          if (typing) {
            setIsTyping({ name: typingUser?.name || "Someone" });
          } else {
            setIsTyping(null);
          }
        }
      }
    };

    socket.current.on("receiveMessage", handleReceiveMessage);
    socket.current.on("typing", handleTyping);

    socket.current.on("messageSeenConfirmation", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "seen" } : msg
        )
      );
    });

    return () => {
      socket.current.off("receiveMessage", handleReceiveMessage);
      socket.current.off("typing", handleTyping);
      socket.current.off("messageSeenConfirmation");
      socket.current.disconnect();
      socket.current = null;
    };
  }, [currentUser?._id]);

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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8888/api/v1/group/joined", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data?.groups || []);
      } catch (err) {
        console.error("❌ Failed to fetch groups", err);
      }
    };

    if (currentUser?._id) fetchGroups();
  }, [currentUser]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedUser || !currentUser) return;

      try {
        const res = await axios.get("http://localhost:8888/api/v1/user/conversation", {
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
  }, [selectedUser?._id, currentUser?._id]);

  useEffect(() => {
    const fetchGroupMessages = async () => {
      if (!selectedGroup || !currentUser) return;

      try {
        const res = await axios.get(
          `http://localhost:8888/api/v1/group/messages/${selectedGroup._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch group messages:", err);
      }
    };

    fetchGroupMessages();
  }, [selectedGroup?._id, currentUser?._id]);

  useEffect(() => {
    if (!socket.current || !selectedUser || !messages.length || !currentUser?._id) return;

    const unseenMessages = messages.filter(
      (msg) =>
        msg.sender === selectedUser._id &&
        msg.receiver === currentUser._id &&
        msg.status !== "seen"
    );

    unseenMessages.forEach((msg) => {
      socket.current.emit("messageSeen", {
        messageId: msg._id,
        receiverId: currentUser._id,
      });
    });
  }, [selectedUser, messages, currentUser?._id]);

  useEffect(() => {
    if (!socket.current || !selectedGroup || !messages.length || !currentUser?._id) return;

    const timer = setTimeout(() => {
      const unseenMessages = messages.filter(
        (msg) =>
          msg.sender !== currentUser._id &&
          msg.status !== "seen"
      );

      unseenMessages.forEach((msg) => {
        socket.current.emit("messageSeen", {
          messageId: msg._id,
          receiverId: currentUser._id,
        });
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedGroup, messages, currentUser?._id]);

  const handleSend = async (formData) => {
    const text = formData.get("content");
    const file = formData.get("usermassage");
    let fileUrl = null;

    if (file) {
      const uploadRes = await axios.post(
        "http://localhost:8888/api/v1/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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

  if (loading || !currentUser) return null;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: "1rem" }}>
        <UserInfo user={currentUser} />
        <ContactList
          users={users}
          groups={groups}
          selectedUserId={selectedUser?._id}
          selectedGroupId={selectedGroup?._id}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setSelectedGroup(null);
            setMessages([]);
          }}
          onSelectGroup={(group) => {
            setSelectedGroup(group);
            setSelectedUser(null);
            setMessages([]);

            if (socket.current && group?._id) {
              socket.current.emit("joinGroup", group._id);
            }
          }}
        />
      </div>

      <ChatPanel
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        messages={messages}
        onSend={handleSend}
        currentUserId={currentUser._id}
        isTyping={isTyping}
        onTyping={(typing) => {
          if (socket.current) {
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
          }
        }}
      />
    </div>
  );
}

export default Chat;
