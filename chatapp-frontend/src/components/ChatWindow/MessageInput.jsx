import React, { useState, useEffect } from "react";

function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (onTyping) {
      onTyping(true); // user started typing
      const timeout = setTimeout(() => {
        onTyping(false); // user stopped typing after inactivity
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text && !file) return;

    const formData = new FormData();
    formData.append("content", text);
    if (file) formData.append("usermassage", file);

    onSend(formData);
    setText("");
    setFile(null);
    onTyping(false); // stop typing on send
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", padding: "10px" }}>
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1 }}
      />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;
