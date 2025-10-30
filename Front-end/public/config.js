/**
 * Configuração Supabase
 * IMPORTANTE: Em produção, mover para variáveis de ambiente
 * Criar arquivo .env.local e adicionar ao .gitignore
 */
const SUPABASE_URL = 'https://crpewmsqskavzrfgmvkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGV3bXNxc2thdnpyZmdtdmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTQ3MjEsImV4cCI6MjA3NjgzMDcyMX0.pLYdS9fNuicWZil6k5Fd8L_xI6s99tKfCUMxmNKgsSM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Database Helper - Camada de abstração para Supabase
 * Adiciona tratamento de erros e validações
 */
class Database {
  static async getUsers() {
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Não foi possível carregar os usuários');
    }
  }

  static async createUser(userData) {
    try {
      // Validação básica
      if (!userData.name || !userData.phone || !userData.password) {
        throw new Error('Dados obrigatórios não fornecidos');
      }
      
      const { data, error } = await supabase.from('users').insert([{
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
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async updateUser(id, userData) {
    try {
      const updateData = {};
      if (userData.name) updateData.name = userData.name.trim();
      if (userData.email !== undefined) updateData.email = userData.email?.trim().toLowerCase() || null;
      if (userData.phone) updateData.phone = userData.phone.replace(/\D/g, '');
      if (userData.password) updateData.password = userData.password;
      
      const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Não foi possível atualizar o usuário');
    }
  }

  static async deleteUser(id) {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Não foi possível excluir o usuário');
    }
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
    try {
      const { data, error } = await supabase.from('stamps').select('*').eq('user_id', userId).order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar selos:', error);
      throw new Error('Não foi possível carregar os selos');
    }
  }

  static async deleteStamp(stampId) {
    try {
      const { error } = await supabase.from('stamps').delete().eq('id', stampId);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar selo:', error);
      throw new Error('Não foi possível remover o selo');
    }
  }

  static async resetUserStamps(userId) {
    try {
      const { error } = await supabase.from('stamps').delete().eq('user_id', userId);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao resetar selos:', error);
      throw new Error('Não foi possível resetar os selos');
    }
  }

  // Buscar usuário por nome (case-insensitive)
  static async getUserByName(name) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('name', name)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  // Estatísticas para dashboard
  static async getStats() {
    try {
      const [users, stamps] = await Promise.all([
        this.getUsers(),
        supabase.from('stamps').select('*')
      ]);
      
      return {
        totalUsers: users.length,
        totalStamps: stamps.data?.length || 0,
        completedCards: users.filter(async u => {
          const userStamps = await this.getUserStamps(u.id);
          return userStamps.length >= 10;
        }).length
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { totalUsers: 0, totalStamps: 0, completedCards: 0 };
    }
  }
}