/**
 * Configuração Supabase - Versão Final Corrigida
 */

const SUPABASE_URL = 'https://crpewmsqskavzrfgmvkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGV3bXNxc2thdnpyZmdtdmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTQ3MjEsImV4cCI6MjA3NjgzMDcyMX0.pLYdS9fNuicWZil6k5Fd8L_xI6s99tKfCUMxmNKgsSM';

// Usar variável local para evitar conflitos
let supabaseClient = null;
let Database = null;

// Inicialização segura
function initApp() {
  if (window.supabase && !supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Criar Database
    Database = {
      async getUsers() {
        const { data, error } = await supabaseClient.from('users').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      },

      async createUser(userData) {
        const { data, error } = await supabaseClient.from('users').insert([{
          name: userData.name.trim(),
          email: userData.email?.trim().toLowerCase() || null,
          phone: userData.phone.replace(/\D/g, ''),
          password: userData.password,
          created_at: new Date().toISOString()
        }]).select();
        
        if (error) {
          if (error.code === '23505') throw new Error('Usuário já cadastrado');
          throw error;
        }
        return data[0];
      },

      async updateUser(id, userData) {
        const updateData = {};
        if (userData.name) updateData.name = userData.name.trim();
        if (userData.email !== undefined) updateData.email = userData.email?.trim().toLowerCase() || null;
        if (userData.phone) updateData.phone = userData.phone.replace(/\D/g, '');
        if (userData.password) updateData.password = userData.password;
        
        const { data, error } = await supabaseClient.from('users').update(updateData).eq('id', id).select();
        if (error) throw error;
        return data[0];
      },

      async deleteUser(id) {
        const { error } = await supabaseClient.from('users').delete().eq('id', id);
        if (error) throw error;
      },

      async addStamp(userId, stampData) {
        const { data, error } = await supabaseClient.from('stamps').insert([{
          user_id: userId,
          ...stampData
        }]).select();
        
        if (error) throw new Error(`Erro ao adicionar selo: ${error.message}`);
        return data[0];
      },

      async getUserStamps(userId) {
        const { data, error } = await supabaseClient.from('stamps').select('*').eq('user_id', userId).order('created_at', { ascending: true });
        if (error) throw error;
        return data || [];
      },

      async deleteStamp(stampId) {
        const { error } = await supabaseClient.from('stamps').delete().eq('id', stampId);
        if (error) throw error;
      },

      async resetUserStamps(userId) {
        const { error } = await supabaseClient.from('stamps').delete().eq('user_id', userId);
        if (error) throw error;
      },

      async getUserByName(name) {
        const { data, error } = await supabaseClient.from('users').select('*').ilike('name', name).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      },

      async authenticateAdmin(username, password) {
        const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
        if (username === 'admin' && password === storedPassword) {
          return { id: 1, username: 'admin', created_at: new Date().toISOString() };
        }
        return null;
      },

      async updateAdminPassword(username, newPassword) {
        localStorage.setItem('adminPassword', newPassword);
        return true;
      }
    };
    
    // Tornar disponível globalmente sem conflitos
    window.Database = Database;
    window.supabaseClient = supabaseClient;
    
    console.log('✅ App inicializado');
    return true;
  }
  return false;
}

// Tentar inicializar
setTimeout(initApp, 100);