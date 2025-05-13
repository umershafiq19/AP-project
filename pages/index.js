import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/component/Navbar";

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(null);

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
  const checkAuthAndFetchData = async () => {
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      
      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  checkAuthAndFetchData();
}, [router]);


useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username); // ✅ Save username into state
        }
      } catch (error) {
        console.error("Failed to fetch logged-in user:", error);
      }
    };

    fetchUsername();
  }, []);

  if (!users.length) return <div>Loading...</div>;

  // Display only one post per user
  const allPosts = users.map((user) => ({
    ...user.posts[0], // Get the first post of each user
    user,
  }));
 

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#111", color: "#fff" }}>
      {/* Sidebar */}
      <Navbar></Navbar>

      {/* Main Content */}
      <main
        style={{
          marginLeft: "250px", // same as sidebar width
          flex: 1,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "600px", width: "100%" }}>
          {allPosts.map((post) => (
            <PostCard key={post.id} post={post} router={router} />
          ))}
        </div>
      </main>
    </div>
  );
}



function PostCard({ post, router }) {
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
    await fetch(`/api/${post.id}/like`, {
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
    <div style={{ width: "100%", border: "1px solid #444", borderRadius: "12px", overflow: "hidden", backgroundColor: "#1a1a1a", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 15px", backgroundColor: "#222", borderBottom: "1px solid #333" }}>
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

      <div style={{ position: "relative", width: "100%", height: "300px" }}>
        <Image src={post.image} alt="Post" layout="fill" objectFit="cover" />
      </div>

      <div style={{ padding: "15px" }}>
        <p>{post.caption}</p>
        <p style={{ color: "#aaa", marginBottom: "10px" }}>{likes} likes</p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
  <button onClick={handleLike} style={buttonStyle("❤️", "#ff4081")}>❤️ Like</button>
  <button onClick={() => setShowCommentBox(!showCommentBox)} style={buttonStyle("💬", "#00bcd4")}>💬 Comment</button>
  <button style={buttonStyle("🔗", "#9c27b0")}>🔗 Share</button>
  {/* <Link href="/messages/[converstionID].js" passHref>
    <button style={buttonStyle("✉️", "#3f51b5")}>✉️ Messages</button>
  </Link> */}
</div>


        {showCommentBox && (
          <form onSubmit={handleCommentSubmit}>
            <input
              name="comment"
              placeholder="Write a comment..."
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
                marginBottom: "8px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "6px 12px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
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
