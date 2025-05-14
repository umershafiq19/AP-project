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

  const navItems = [
    { href: "/", label: "🏠 Home" },
    { href: "/explore", label: "🔍 Explore" },
    { href: "/messages", label: "📥 Inbox" },
    { href: "/notifications", label: "🔔 Notifications" },
    { href: "/upload", label: "📸 Add a Post" },
  ];

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
        gap: "25px",
        borderRight: "1px solid #333",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: "bold" }}>Connectify</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              ...navLinkStyle,
              backgroundColor: router.pathname === item.href ? "#333" : "transparent",
            }}
          >
            {item.label}
          </Link>
        ))}

        <button
          onClick={goToProfile}
          style={{
            ...navLinkStyle,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          👤 Profile
        </button>

        <button
  onClick={handleSignOut}
  style={{
    ...navLinkStyle,
    border: "none",
    background: "none",
    cursor: "pointer",
    textAlign: "left",
    color: "#f55",
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
>
  🚪 Sign Out
</button>

      </nav>
    </aside>
  );
}

const navLinkStyle = {
  color: "#ccc",
  textDecoration: "none",
  fontSize: "17px",
  padding: "10px 15px",
  borderRadius: "8px",
  transition: "background-color 0.3s ease",
  display: "block",
};

