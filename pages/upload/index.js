//pages/upload/index.js
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/component/Navbar';

export default function UploadPhoto() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [banner, setBanner] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate if the file is an image
      if (!file.type.startsWith('image/')) {
        setBanner({ message: 'Please upload a valid image.', type: 'error' });
        setImage(null);
        setPreview(null);
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;

    if (!image) {
      setBanner({ message: 'Please upload an image.', type: 'error' });
      return;
    }

    if (!caption) {
      setBanner({ message: 'Please add a caption.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    setIsSubmitting(true); // Disable further submissions while uploading

    try {
      const res = await fetch('/api/uploadphoto/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies in the request
      });

      if (res.ok) {
        const data = await res.json();
        setBanner({ message: 'Posted successfully!', type: 'success' });
        setImage(null);
        setPreview(null);
        setCaption('');

        setTimeout(() => {
          setBanner({ message: '', type: '' });
        }, 2000);
      } else {
        const error = await res.json();
        setBanner({ message: error.message || 'Failed to post. Please try again.', type: 'error' });
      }
    } catch (error) {
      setBanner({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false); // Re-enable submission button
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111', color: '#fff' }}>
      {/* Reusable Sidebar */}
      <Navbar />

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

        {/* Post Form */}
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

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

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
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'POST'}
          </button>
        </div>
      </main>
    </div>
  );
}
