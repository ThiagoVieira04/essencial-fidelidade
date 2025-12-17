/**
 * Configuração Supabase - Versão Final
 */

const SUPABASE_URL = 'https://crpewmsqskavzrfgmvkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGV3bXNxc2thdnpyZmdtdmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTQ3MjEsImV4cCI6MjA3NjgzMDcyMX0.pLYdS9fNuicWZil6k5Fd8L_xI6s99tKfCUMxmNKgsSM';

// Usar namespace para evitar conflitos
window.AppConfig = {
  supabase: null,
  Database: null,
  
  init() {
    if (window.supabase && !this.supabase) {
      this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      this.createDatabase();
      console.log('✅ App inicializado');
    }
  },
  
  createDatabase() {
    this.Database = {
      async getUsers() {
        const { data, error } = await window.AppConfig.supabase.from('users').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      },

      async createUser(userData) {
        const { data, error } = await window.AppConfig.supabase.from('users').insert([{
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
        
        const { data, error } = await window.AppConfig.supabase.from('users').update(updateData).eq('id', id).select();
        if (error) throw error;
        return data[0];
      },

      async deleteUser(id) {
        const { error } = await window.AppConfig.supabase.from('users').delete().eq('id', id);
        if (error) throw error;
      },

      async addStamp(userId, stampData) {
        const { data, error } = await window.AppConfig.supabase.from('stamps').insert([{
          user_id: userId,
          ...stampData
        }]).select();
        
        if (error) throw new Error(`Erro ao adicionar selo: ${error.message}`);
        return data[0];
      },

      async getUserStamps(userId) {
        const { data, error } = await window.AppConfig.supabase.from('stamps').select('*').eq('user_id', userId).order('created_at', { ascending: true });
        if (error) throw error;
        return data || [];
      },

      async deleteStamp(stampId) {
        const { error } = await window.AppConfig.supabase.from('stamps').delete().eq('id', stampId);
        if (error) throw error;
      },

      async resetUserStamps(userId) {
        const { error } = await window.AppConfig.supabase.from('stamps').delete().eq('user_id', userId);
        if (error) throw error;
      },

      async getUserByName(name) {
        const { data, error } = await window.AppConfig.supabase.from('users').select('*').ilike('name', name).single();
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
  }
};

// Aliases globais para compatibilidade
Object.defineProperty(window, 'Database', {
  get() { return window.AppConfig.Database; }
});

Object.defineProperty(window, 'supabase', {
  get() { return window.AppConfig.supabase; },
  configurable: true
});

// Inicializar
setTimeout(() => window.AppConfig.init(), 100);