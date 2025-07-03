import React, { useState, useRef, useEffect } from "react";

function LogoutButton() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleDelete = () => {
    alert("Delete Account clicked (you can connect this to API)");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
     

      {/* Dropdown Menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: 0,
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            zIndex: 10,
            minWidth: "150px",
            padding: "0.5rem 0",
          }}
        >
          <div
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              color: "#ff4d4f",
              fontWeight: "bold",
              borderBottom: "1px solid #eee",
            }}
          >
            Logout
          </div>
          <div
            onClick={handleDelete}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              color: "#d9363e",
              fontWeight: "bold",
            }}
          >
            Delete Account
          </div>
        </div>
      )}
    </div>
  );
}

export default LogoutButton;
