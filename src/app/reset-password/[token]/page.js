'use client';

import { useState, use } from 'react'; // use ekle
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../../globals.css';

export default function ResetPassword({ params }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const token = use(params); // params'ı unwrap et
  console.log('Token from params:', token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting with token:', token);
    if (!token) {
      setError('Token bulunamadı');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, password }), // token'ı string olarak gönder
      });
      const data = await res.json();
      console.log('Response:', data);
      if (res.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Bir hata oluştu');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Bir hata oluştu');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url('/background.jpg')`, // Düzeltildi
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="auth-box"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '8px',
          width: '320px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Şifre Sıfırlama</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '10px', width: '250px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Yeni şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'left', boxSizing: 'border-box', paddingRight: '40px' }}
              required
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#bdbab9',
                fontSize: '18px',
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#3c5b8c',
              color: 'white',
              padding: '10px',
              width: '250px',
              border: 'none',
              borderRadius: '5px',
              marginBottom: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#2f69c6')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3c5b8c')}
          >
            Şifreyi Sıfırla
          </button>
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        </form>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            width: '250px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#2f69c6')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}