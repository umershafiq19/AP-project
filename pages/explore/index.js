import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/Search.module.css"; 

export default function SearchPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true); // 🆕 Loading state

  // Fetch user list (runs only on the client)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter suggestions while typing
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

  // Exact match search
  const handleSearch = () => {
    const exactMatch = users.find(
      (u) => u.username.toLowerCase() === searchTerm.toLowerCase()
    );
    setResult(exactMatch || null);
  };

  return (
  <div className={styles.container}>
    {/* Sidebar */}
    <aside className={styles.sidebar}>
      <h2>Connectify</h2>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>🏠 Home</Link>
        <Link href="/explore" className={styles.navLink}>🔍 Explore</Link>
        <Link href="/notifications" className={styles.navLink}>🔔 Notifications</Link>
        <Link href="/upload/" className={styles.navLink}>📸 Add a Post</Link>
        <Link href="/profile" className={styles.navLink}>👤 Profile</Link>
      </nav>
    </aside>

    {/* Main */}
    <main className={styles.main}>
      <h1>🔍 Search Users</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className={styles.searchInput}
          placeholder="Search by username..."
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>

      {!loading && filtered.length > 0 && (
        <div className={styles.suggestionsBox}>
          {filtered.map((user) => (
            <Link key={user.id} href={`/profile/${user.username}`}>
              <div className={styles.suggestionItem}>
                <img src={user.avatar} alt="avatar" width={36} height={36} className={styles.avatar} />
                <span style={{ color: "#80d8ff", fontWeight: "bold" }}>@{user.username}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && result && (
        <div className={styles.resultBox}>
          <h3>Search Result:</h3>
          <Link href={`/profile/${result.username}`}>
            <div className={styles.resultItem}>
              <img src={result.avatar} alt="avatar" width={36} height={36} className={styles.avatar} />
              <span style={{ color: "#4fc3f7", fontWeight: "bold" }}>@{result.username}</span>
            </div>
          </Link>
        </div>
      )}
    </main>
  </div>
);
}