import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfile({ user, posts }) {
  const router = useRouter();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "#111", color: "#fff", padding: "20px" }}>
      {/* User Information */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <img
          src={user.avatar}
          alt="avatar"
          width={120}
          height={120}
          style={{ borderRadius: "50%", border: "4px solid purple", objectFit: "cover" }}
        />
        <div>
          <h2>@{user.username}</h2>
          <p>{user.name}</p>
          <p>{user.bio}</p>
          <p>Followers: {user.followers}</p>
          <p>Following: {user.following}</p>
        </div>
      </div>

      {/* Posts */}
      <h3 style={{ marginBottom: "20px" }}>Posts</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ border: "1px solid #444", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ position: "relative", width: "100%", height: "300px" }}>
                <Image src={post.image} alt="Post" layout="fill" objectFit="cover" />
              </div>
              <div style={{ padding: "10px" }}>
                <p>{post.caption}</p>
                <p>{post.likes} likes</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch user
    const userResponse = await fetch(`${baseUrl}/api/users/${username}`);
    if (!userResponse.ok) {
      console.error(`User fetch failed: ${userResponse.status}`);
      return { notFound: true };
    }
    const user = await userResponse.json();

    // Fetch posts
    const postsResponse = await fetch(`${baseUrl}/api/posts/${username}`);
    if (!postsResponse.ok) {
      console.error(`Posts fetch failed: ${postsResponse.status}`);
      return { props: { user, posts: [] } }; // No posts but user exists
    }
    const posts = await postsResponse.json();

    return {
      props: {
        user,
        posts,
      },
    };
  } catch (error) {
    console.error("Error fetching user or posts:", error);
    return { notFound: true };
  }
}
