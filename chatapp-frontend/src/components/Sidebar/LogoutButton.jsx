import React from "react";

function LogoutButton() {
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: "1rem",
        backgroundColor: "#ff4d4f",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        width: "100%",
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
