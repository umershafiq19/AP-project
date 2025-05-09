import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Search, Bell, User, Compass } from "lucide-react";

export default function SearchPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFiltered([]);
    } else {
      const matches = users.filter((u) =>
        u.username.toLowerCase().includes(term.toLowerCase())
      );
      setFiltered(matches);
    }
  };

  const handleSearch = () => {
    const exactMatch = users.find(
      (u) => u.username.toLowerCase() === searchTerm.toLowerCase()
    );
    setResult(exactMatch || null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#111", color: "#fff" }}>
      {/* Sidebar */}
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
              <h2 style={{ color: '#fff', marginBottom: '30px', fontSize: '24px' }}>Connectify</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/" style={navLinkStyle}>🏠 Home</Link>
          <Link href="/explore" style={navLinkStyle}>🔍 Explore</Link>
          <Link href="/notifications" style={navLinkStyle}>🔔 Notifications</Link>
          <Link href="/upload/" style={navLinkStyle}>📸 Add a Post</Link>
          <Link href="/profile" style={navLinkStyle}>👤 Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: "250px", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ marginBottom: "20px", fontSize: "28px" }}>🔍 Search Users</h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search by username..."
            style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid #444",
              backgroundColor: "#1f1f1f",
              color: "#fff",
              width: "300px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {/* Suggestions while typing */}
        {filtered.length > 0 && (
          <div style={{ width: "320px", backgroundColor: "#222", borderRadius: "10px", padding: "10px", marginBottom: "20px" }}>
            {filtered.map((user) => (
              <Link key={user.id} href={`/profile/${user.username}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    borderBottom: "1px solid #333",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={user.avatar}
                    alt="avatar"
                    width={36}
                    height={36}
                    style={{ borderRadius: "50%", marginRight: "10px", border: "2px solid #444" }}
                  />
                  <span style={{ color: "#80d8ff", fontWeight: "bold" }}>@{user.username}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        

        {/* Exact search result */}
        {result && (
          <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "10px", width: "300px" }}>
            <h3>Search Result:</h3>
            <Link href={`/profile/${result.username}`}>
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                <img
                  src={result.avatar}
                  alt="avatar"
                  width={36}
                  height={36}
                  style={{ borderRadius: "50%", marginRight: "10px", border: "2px solid #444" }}
                />
                <span style={{ color: "#4fc3f7", fontWeight: "bold" }}>@{result.username}</span>
              </div>
            </Link>
          </div>
        )}

        {result === null && searchTerm && (
          <p style={{ marginTop: "20px", color: "#ccc" }}>No exact match found.</p>
        )}
      </main>
    </div>
  );
}

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "10px",
  color: "#fff",
  textDecoration: "none",
  backgroundColor: "#333",
  transition: "background 0.3s",
};
const navLinkStyle = {
    color: "#ccc",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  };
