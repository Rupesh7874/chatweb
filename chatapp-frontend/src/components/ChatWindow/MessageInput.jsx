import React, { useState, useEffect, useRef } from "react";

function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (onTyping) {
      onTyping(true);
      const timeout = setTimeout(() => {
        onTyping(false);
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
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    onTyping(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", padding: "10px", flexDirection: "column" }}>
      {file && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ maxHeight: "80px", borderRadius: "8px" }}
          />
          <button type="button" onClick={removeImage} style={{ padding: "4px 8px" }}>
            Remove
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button type="submit">Send</button>
      </div>
    </form>
  );
}

export default MessageInput;
