/**
 * Keep-Alive - Versão Corrigida
 */

async function keepSupabaseActive() {
  try {
    if (!window.supabaseClient) {
      console.log('⏳ Aguardando inicialização...');
      return;
    }
    
    const { data, error } = await window.supabaseClient.from('users').select('count').limit(1);
    
    if (!error) {
      console.log('✓ Supabase ativo:', new Date().toISOString());
    }
  } catch (error) {
    console.error('Keep-alive error:', error);
  }
}

function startKeepAlive() {
  if (window.supabaseClient) {
    keepSupabaseActive();
    setInterval(keepSupabaseActive, 6 * 24 * 60 * 60 * 1000);
  } else {
    setTimeout(startKeepAlive, 1000);
  }
}

setTimeout(startKeepAlive, 2000);