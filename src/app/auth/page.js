'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '../lib/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Şifre görünürlüğü için state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Hata mesajını sıfırla

    try {
      if (isLogin) {
        await login(email, password); // E-posta ile login
        router.push('/'); // Giriş başarılıysa ana sayfaya yönlendir
      } else {
        await register(email, password); // E-posta ile register
        setError('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setIsLogin(true); // Kayıt sonrası giriş moduna geç
        setPassword(''); // Kayıt başarılıysa şifreyi temizle
      }
    } catch (err) {
      setError(err.message); // Hata mesajını doğrudan göster
      if (!isLogin && err.message === 'Kullanıcı bulunamadı. Kayıt olunuz.') {
        setError(''); // Kayıt ol modunda bu hata mesajını gizle
      }
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError(''); // Mod değiştiğinde hata mesajını temizle
    setPassword(''); // Her mod değişiminde şifreyi temizle
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Şifre görünürlüğünü değiştir
  };

  return (
    <div
      className="auth-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Arka plan resmi için ayrı bir div */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/background.jpg) !important', // Çakışmayı önlemek için !important
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7, // Arka plan resminin opaklığını %50 yap
          zIndex: -1, // Formun altına yerleştir
        }}
      />
      <div className="auth-form">
        <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'} // Şifre görünürlüğüne göre type değişiyor
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '40px', width: '100%' }} // İkona yer aç
            />
            <i
              className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} // Görünürlüğe göre ikon değişiyor
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
            />
          </div>
          {error && (
            <p style={{ color: error === 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' ? 'blue' : 'red' }}>
              {error}
            </p>
          )}
          <button type="submit">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</button>
        </form>
        <p>
          {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}{' '}
          <a href="#" onClick={handleSwitchMode}>
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </a>
        </p>
      </div>
    </div>
  );
}