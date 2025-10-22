// Configuração Supabase
const SUPABASE_URL = 'https://nfpssoexckpwacifqxgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHNzb2V4Y2twd2FjaWZxeGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTg2MDYsImV4cCI6MjA3NjE3NDYwNn0.YUVIkA6-avS7tN9QX0E6DqwuLs9oOhup_GKxjCA4nBg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper
class Database {
  static async getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || [];
  }

  static async createUser(userData) {
    const { data, error } = await supabase.from('users').insert([userData]).select();
    if (error) throw error;
    return data[0];
  }

  static async updateUser(id, userData) {
    const { data, error } = await supabase.from('users').update(userData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  }

  static async deleteUser(id) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  }

  static async addStamp(userId, stampData) {
    const { data, error } = await supabase.from('stamps').insert([{
      user_id: userId,
      ...stampData
    }]).select();
    if (error) throw error;
    return data[0];
  }

  static async getUserStamps(userId) {
    const { data, error } = await supabase.from('stamps').select('*').eq('user_id', userId);
    if (error) throw error;
    return data || [];
  }

  static async deleteStamp(stampId) {
    const { error } = await supabase.from('stamps').delete().eq('id', stampId);
    if (error) throw error;
  }

  static async resetUserStamps(userId) {
    const { error } = await supabase.from('stamps').delete().eq('user_id', userId);
    if (error) throw error;
  }
}