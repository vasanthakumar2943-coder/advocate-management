import React, { useEffect } from "react";

export default function PendingApproval() {
  useEffect(() => {
    const token = localStorage.getItem("access");

    // 🔐 Safety: if user is logged out
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="container">
      <h2>Your account is pending approval</h2>
      <p>Please wait for admin approval.</p>

      <p style={{ marginTop: "16px", color: "#666" }}>
        You will be able to access your dashboard once approved.
      </p>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => window.location.reload()}
      >
        Check again
      </button>
    </div>
  );
}
