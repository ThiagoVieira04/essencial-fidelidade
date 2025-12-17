/**
 * Keep-Alive - Versão Final
 */

async function keepSupabaseActive() {
  try {
    if (!window.AppConfig?.supabase) {
      console.log('⏳ Aguardando inicialização...');
      return;
    }
    
    const { data, error } = await window.AppConfig.supabase.from('users').select('count').limit(1);
    
    if (!error) {
      console.log('✓ Supabase ativo:', new Date().toISOString());
    }
  } catch (error) {
    console.error('Keep-alive error:', error);
  }
}

function startKeepAlive() {
  if (window.AppConfig?.supabase) {
    keepSupabaseActive();
    setInterval(keepSupabaseActive, 6 * 24 * 60 * 60 * 1000);
  } else {
    setTimeout(startKeepAlive, 1000);
  }
}

setTimeout(startKeepAlive, 2000);