'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../globals.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Bir hata oluştu');
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url('/background.jpg')`,
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
        <h2 style={{ marginBottom: '20px' }}>Şifremi Unuttum</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', width: '250px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#3c5b8c',
              color: 'white',
              padding: '10px',
              width: '250px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#2f69c6')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3c5b8c')}
          >
            Gönder
          </button>
          {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
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
            marginTop: '10px',
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