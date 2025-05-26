import { supabase } from './supabase';

export async function saveMoodData(date, mood, note) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    console.error('Kullanıcı bulunamadı, veri kaydedilemedi.');
    return;
  }

  const { data: existingData } = await supabase
    .from('mood_data')
    .select('id')
    .eq('user_id', user.data.user.id)
    .eq('date', date);

  if (existingData && existingData.length > 0) {
    const { error } = await supabase
      .from('mood_data')
      .update({ mood, note })
      .eq('user_id', user.data.user.id)
      .eq('date', date);

    if (error) {
      console.error('Veri güncelleme hatası:', error.message);
    } else {
      console.log('Veri başarıyla güncellendi:', { date, mood, note });
    }
  } else {
    const { error } = await supabase
      .from('mood_data')
      .insert([{ user_id: user.data.user.id, date, mood, note }]);

    if (error) {
      console.error('Veri kaydetme hatası:', error.message);
    } else {
      console.log('Veri başarıyla kaydedildi:', { date, mood, note });
    }
  }
}

export async function getMoodData(date) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    console.error('Kullanıcı bulunamadı, veri alınamadı.');
    return { mood: '', note: '' };
  }

  const { data, error } = await supabase
    .from('mood_data')
    .select('mood, note')
    .eq('user_id', user.data.user.id)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('Veri alma hatası:', error.message);
    return { mood: '', note: '' };
  }

  return data || { mood: '', note: '' };
}

export async function getAllMoodData() {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    console.error('Kullanıcı bulunamadı, tüm veriler alınamadı.');
    return {};
  }

  const { data, error } = await supabase
    .from('mood_data')
    .select('date, mood, note')
    .eq('user_id', user.data.user.id);

  if (error) {
    console.error('Tüm verileri alma hatası:', error.message);
    return {};
  }

  const moodData = {};
  data.forEach((entry) => {
    moodData[entry.date] = { mood: entry.mood, note: entry.note };
  });

  return moodData;
}