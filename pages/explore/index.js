import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/component/Navbar"; 
import styles from "../../styles/Search.module.css"; 

export default function SearchPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setResult(null);
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
    <div className={styles.container}>
      <Navbar />

      
      <main className={styles.main}>
        <h1>🔍 Search Users</h1>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className={styles.searchInput}
            placeholder="Search by username..."
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Search
          </button>
        </div>

        {loading && <p style={{ color: "#aaa" }}>Loading users...</p>}

        {!loading && filtered.length > 0 && (
          <div className={styles.suggestionsBox}>
            {filtered.map((user) => (
              <Link key={user.id} href={`/profile/${user.username}`}>
                <div className={styles.suggestionItem}>
                  <img src={user.avatar} alt="avatar" width={36} height={36} className={styles.avatar} />
                  <span style={{ color: "#80d8ff", fontWeight: "bold" }}>
                    @{highlightMatch(user.username, searchTerm)}
                  </span>
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


function highlightMatch(username, term) {
  const index = username.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return username;

  const before = username.slice(0, index);
  const match = username.slice(index, index + term.length);
  const after = username.slice(index + term.length);

  return (
    <>
      {before}
      <span style={{ textDecoration: "underline", color: "#fff" }}>{match}</span>
      {after}
    </>
  );
}
