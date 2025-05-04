import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [username]);

  if (!user) return <div style={styles.loading}>Loading profile...</div>;

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <Image
          src={user.avatar}
          alt="Avatar"
          width={80}
          height={80}
          style={{ borderRadius: "50%", border: "2px solid #fff" }}
        />
        <div style={{ marginLeft: "20px" }}>
          <h2>@{user.username}</h2>
          <p>{user.bio}</p>
          <p style={{ color: "#ccc" }}>
            {user.followers} followers • {user.following} following
          </p>
        </div>
      </div>

      {/* User Posts */}
      <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 posts per row
          gap: "15px",
          maxWidth: "900px",
          width: "100%",
        }}>
        {user?.posts?.length > 0 ? (
          user.posts.map((post) => (
            <PostCard key={post.id} post={{ ...post, user }} />
          ))
        ) : (
          <p style={{ color: "#888" }}>No posts to display.</p>
        )}
      </div>
    </div>
  );
}

// --- PostCard copied from Home page ---
function PostCard({ post }) {
  const storedLikes = localStorage.getItem(`likes-${post.id}`);
  const storedComments = JSON.parse(localStorage.getItem(`comments-${post.id}`)) || [];

  const [likes, setLikes] = useState(storedLikes ? parseInt(storedLikes) : post.likes || 0);
  const [hasLiked, setHasLiked] = useState(!!storedLikes);
  const [comments, setComments] = useState(storedComments);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleLike = async () => {
    const newLikes = hasLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setHasLiked(!hasLiked);
    localStorage.setItem(`likes-${post.id}`, newLikes);

    await fetch(`/api/posts/${post.id}/like`, {
      method: hasLiked ? "DELETE" : "POST",
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const comment = e.target.elements.comment.value;
    const newComments = [...comments, comment];
    setComments(newComments);
    e.target.reset();
    localStorage.setItem(`comments-${post.id}`, JSON.stringify(newComments));

    await fetch(`/api/posts/${post.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
  };

  return (
    <div style={styles.postCard}>
      {/* Username and Avatar */}
      <div style={styles.postHeader}>
        <img
          src={post.user.avatar}
          alt="Avatar"
          width={40}
          height={40}
          style={{ borderRadius: "50%", marginRight: "10px", border: "2px solid #fff" }}
        />
        <Link href={`/profile/${post.user.username}`}>
          <p style={{ color: "lightblue", fontWeight: "bold", cursor: "pointer" }}>@{post.user.username}</p>
        </Link>
      </div>

      {/* Image */}
      <div style={{ position: "relative", width: "100%", height: "300px" }}>
        <Image src={post.image} alt="Post" layout="fill" objectFit="cover" />
      </div>

      {/* Caption and Actions */}
      <div style={{ padding: "15px" }}>
        <p>{post.caption}</p>
        <p style={{ color: "#aaa", marginBottom: "10px" }}>{likes} likes</p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button onClick={handleLike} style={buttonStyle("❤️", "#ff4081")}>❤️ Like</button>
          <button onClick={() => setShowCommentBox(!showCommentBox)} style={buttonStyle("💬", "#00bcd4")}>💬 Comment</button>
          <button style={buttonStyle("🔗", "#9c27b0")}>🔗 Share</button>
        </div>

        {showCommentBox && (
          <form onSubmit={handleCommentSubmit}>
            <input
              name="comment"
              placeholder="Write a comment..."
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #555", backgroundColor: "#222", color: "#fff", marginBottom: "8px" }}
            />
            <button type="submit" style={{ padding: "6px 12px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              Post
            </button>
          </form>
        )}

        <div style={{ marginTop: "10px", color: "#ccc" }}>
          {comments.map((c, idx) => (
            <p key={idx} style={{ marginBottom: "4px" }}>💬 {c}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function buttonStyle(icon, color) {
  return {
    backgroundColor: color,
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  };
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#111",
    color: "#fff",
    minHeight: "100vh",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    padding: "50px",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    borderBottom: "1px solid #444",
    paddingBottom: "20px",
  },
  postsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",          // 👈 Center children horizontally
    gap: "15px",
  },
  postCard: {
    width: "100%",
    maxWidth: "500px",             // 👈 Limit the width
    border: "1px solid #444",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    backgroundColor: "#222",
    borderBottom: "1px solid #333",
  },
};

