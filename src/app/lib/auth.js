import { supabase } from './supabase';

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(
      error.message === 'Invalid login credentials'
        ? 'Kullanıcı bulunamadı. Kayıt olunuz.'
        : error.message === 'Email not confirmed'
        ? 'E-posta adresiniz doğrulanmadı. Lütfen gelen kutunuzu kontrol edin ve doğrulama linkine tıklayın.'
        : error.message
    );
  }
  return data.user;
}

export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw new Error(
      error.message === 'Email already exists'
        ? 'Bu e-posta zaten kayıtlı. Lütfen giriş yapmayı deneyin.'
        : error.message
    );
  }
  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Çıkış hatası: ${error.message}`);
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Kullanıcı oturumu bulunamadı.');
  }
  return data.user;
}