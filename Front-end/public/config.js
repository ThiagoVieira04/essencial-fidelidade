// Configuração Supabase
const SUPABASE_URL = 'https://crpewmsqskavzrfgmvkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGV3bXNxc2thdnpyZmdtdmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTQ3MjEsImV4cCI6MjA3NjgzMDcyMX0.pLYdS9fNuicWZil6k5Fd8L_xI6s99tKfCUMxmNKgsSM';

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
    console.log('Tentando adicionar selo para usuário:', userId);
    const { data, error } = await supabase.from('stamps').insert([{
      user_id: userId,
      ...stampData
    }]).select();
    
    if (error) {
      console.error('Erro detalhado ao adicionar selo:', error);
      throw new Error(`Erro ao adicionar selo: ${error.message}`);
    }
    
    console.log('Selo adicionado com sucesso:', data);
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