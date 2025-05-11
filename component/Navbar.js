import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState(null);

  const goToProfile = () => {
    if (username) {
      router.push(`/profile/${username}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Failed to fetch logged-in user:", error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <aside
      style={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#1e1e1e",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        borderRight: "1px solid #333",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: "30px", fontSize: "24px" }}>Connectify</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link href="/" style={navLinkStyle}>🏠 Home</Link>
        <Link href="/explore" style={navLinkStyle}>🔍 Explore</Link>
        <Link href="/messages" style={navLinkStyle}>📥 Inbox</Link>
        <Link href="/notifications" style={navLinkStyle}>🔔 Notifications</Link>
        <Link href="/upload" style={navLinkStyle}>📸 Add a Post </Link>
        <button onClick={goToProfile} style={{ ...navLinkStyle, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
          👤 Profile
        </button>
        <button onClick={handleSignOut} style={{ ...navLinkStyle, backgroundColor: "#333", border: "none", cursor: "pointer", textAlign: "left" }}>
          🚪 Sign Out
        </button>
      </nav>
    </aside>
  );
}

const navLinkStyle = {
  color: "#ccc",
  textDecoration: "none",
  fontSize: "18px",
  padding: "10px 15px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
};
