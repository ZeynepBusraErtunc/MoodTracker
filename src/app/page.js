'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './globals.css';


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        router.push('/calendar');
      } else {
        // "User not found" mesajını Türkçe'ye çevir
        if (data.error === 'User not found') {
          setError('Kullanıcı bulunamadı');
        } else {
          setError(data.error || 'Giriş başarısız');
        }
      }
    } catch (err) {
      setError('Bir hata oluştu');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
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
        <h2 style={{ marginBottom: '20px' }}>Giriş Yap</h2>
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px', padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'left', boxSizing: 'border-box' }}
            required
          />
          <div style={{ position: 'relative', marginBottom: '10px', width: '250px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Şifre"
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
              backgroundColor: '#3b82f6',
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
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')}
          >
            Giriş Yap
          </button>
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        </form>
        <button
          onClick={handleForgotPassword}
          style={{
            backgroundColor: '#ccc',
            color: '#333',
            padding: '8px',
            width: '250px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#b3b3b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ccc')}
        >
          Şifremi Unuttum
        </button>
        <p>Hesabınız yok mu?</p>
        <button
          onClick={() => router.push('/auth')}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            width: '250px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#21813b')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}