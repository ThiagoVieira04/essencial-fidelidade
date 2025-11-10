/**
 * Keep-Alive para Supabase
 * Mantém o projeto ativo fazendo pings periódicos
 */

async function keepSupabaseActive() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (!error) {
      console.log('✓ Supabase ativo:', new Date().toISOString());
    }
  } catch (error) {
    console.error('Keep-alive error:', error);
  }
}

// Executar a cada 6 dias (518400000 ms)
setInterval(keepSupabaseActive, 6 * 24 * 60 * 60 * 1000);

// Executar imediatamente ao carregar
keepSupabaseActive();
