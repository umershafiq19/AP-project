import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function UploadPhoto() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [banner, setBanner] = useState({ message: '', type: '' });
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setBanner({ message: 'Please upload an image.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      const res = await fetch('/api/uploadphoto/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setBanner({ message: 'Posted Successfully!', type: 'success' });
        // Clear the form
        setImage(null);
        setPreview(null);
        setCaption('');
        setTimeout(() => {
          setBanner({ message: '', type: '' });
          router.push('/');
        }, 2000); // Redirect after 2 seconds
      } else {
        setBanner({ message: 'Failed to post. Please try again.', type: 'error' });
      }
    } catch (error) {
      setBanner({ message: 'An error occurred. Please try again.', type: 'error' });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111', color: '#fff' }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#1e1e1e',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderRight: '1px solid #333',
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
      <main style={{ marginLeft: '250px', flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        
        {/* Banner */}
        {banner.message && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              backgroundColor: banner.type === 'success' ? '#4caf50' : '#f44336',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
              animation: 'fadeIn 0.5s',
            }}
          >
            {banner.message}
          </div>
        )}

        {/* Center Rectangle */}
        <div
          style={{
            backgroundColor: '#1e1e1e',
            padding: '30px',
            borderRadius: '12px',
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Create a Post</h2>

          {/* Upload Container */}
          <div
            onClick={handleContainerClick}
            style={{
              width: '250px',
              height: '250px',
              backgroundColor: '#333',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              const overlay = e.currentTarget.querySelector('.hover-text');
              if (overlay) overlay.style.opacity = 1;
            }}
            onMouseLeave={(e) => {
              const overlay = e.currentTarget.querySelector('.hover-text');
              if (overlay) overlay.style.opacity = 0;
            }}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '60px', color: '#777' }}>+</span>
            )}
            <div
              className="hover-text"
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              Upload a photo
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          {/* Caption Textarea */}
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
            style={{
              width: '100%',
              backgroundColor: '#222',
              color: '#ccc',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '20px',
            }}
          />

          {/* Post Button */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            POST
          </button>

        </div>
      </main>
    </div>
  );
}

const navLinkStyle = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '18px',
  padding: '10px 15px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};
