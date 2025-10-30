# 🔐 Configuração de Autenticação Admin

## 📋 Problema Resolvido

O login do painel administrativo não estava validando credenciais contra o banco de dados. Agora o sistema:

✅ Autentica admin via banco de dados Supabase  
✅ Tem fallback para credenciais hardcoded (compatibilidade)  
✅ Permite alterar senha no banco  
✅ Mantém layout e funcionalidades intactas  

---

## 🚀 Instalação (Recomendado)

### **Passo 1: Criar Tabela no Supabase**

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Execute o script `supabase-admin-setup.sql`:

```sql
-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir admin padrão (senha: admin123)
INSERT INTO admins (username, password) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

-- RLS (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Admins can read all admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Admins can update admins" ON admins FOR UPDATE USING (true);
```

4. Clique em **Run** ou pressione `Ctrl+Enter`

---

### **Passo 2: Verificar Instalação**

Execute no SQL Editor:

```sql
SELECT * FROM admins;
```

**Resultado esperado:**
```
id | username | password  | created_at           | updated_at
---+----------+-----------+----------------------+----------------------
 1 | admin    | admin123  | 2025-01-XX XX:XX:XX  | 2025-01-XX XX:XX:XX
```

---

### **Passo 3: Testar Login**

1. Acesse `admin.html`
2. Digite:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
3. Clique em **Entrar**

✅ **Deve funcionar e mostrar:** "Bem-vindo, Administrador!"

---

## 🔄 Como Funciona

### **Sistema de Autenticação com Fallback**

```javascript
// 1. Tenta autenticar no banco de dados
const admin = await Database.authenticateAdmin(username, password);

// 2. Se tabela não existe, usa fallback (localStorage)
if (tabelaNaoExiste) {
  return authenticateAdminFallback(username, password);
}

// 3. Se credenciais corretas, faz login
if (admin) {
  sessionStorage.setItem('adminUser', JSON.stringify(admin));
  showDashboard();
}
```

### **Fluxo de Autenticação**

```
┌─────────────────┐
│  Login Admin    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Database.authenticateAdmin │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │ Tabela  │
    │ existe? │
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
   SIM                   NÃO
    │                     │
    ▼                     ▼
┌─────────┐      ┌──────────────┐
│ Busca   │      │   Fallback   │
│ no BD   │      │ (localStorage)│
└────┬────┘      └──────┬───────┘
     │                  │
     └────────┬─────────┘
              │
              ▼
      ┌───────────────┐
      │ Credenciais   │
      │   corretas?   │
      └───────┬───────┘
              │
         ┌────┴────┐
        SIM       NÃO
         │         │
         ▼         ▼
    ┌────────┐  ┌──────┐
    │ Login  │  │ Erro │
    │  OK    │  │      │
    └────────┘  └──────┘
```

---

## 🔧 Funcionalidades

### **1. Login Admin**
- ✅ Valida contra tabela `admins` no Supabase
- ✅ Fallback para localStorage se tabela não existir
- ✅ Mensagens de erro claras
- ✅ Loading state durante autenticação

### **2. Alterar Senha**
- ✅ Atualiza senha na tabela `admins`
- ✅ Sincroniza com localStorage (compatibilidade)
- ✅ Validações de senha (mínimo 6 caracteres)
- ✅ Confirmação de senha

### **3. Compatibilidade**
- ✅ Funciona COM ou SEM tabela `admins`
- ✅ Não quebra instalações antigas
- ✅ Migração transparente

---

## 🛡️ Segurança

### **⚠️ IMPORTANTE - Produção**

**Atualmente:** Senhas em texto plano (desenvolvimento)  
**Recomendado:** Hash bcrypt (produção)

### **Próximos Passos de Segurança:**

1. **Implementar Hash de Senhas**
```sql
-- Usar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Atualizar senha com hash
UPDATE admins 
SET password = crypt('admin123', gen_salt('bf'))
WHERE username = 'admin';

-- Validar senha
SELECT * FROM admins 
WHERE username = 'admin' 
AND password = crypt('senha_digitada', password);
```

2. **Adicionar Rate Limiting**
```javascript
// Limitar tentativas de login
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos
```

3. **Implementar JWT Tokens**
```javascript
// Usar tokens em vez de sessionStorage
const token = jwt.sign({ username, id }, SECRET_KEY);
```

4. **Migrar para Supabase Auth**
```javascript
// Usar autenticação nativa do Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@essencial.com',
  password: 'senha'
});
```

---

## 🧪 Testes

### **Teste 1: Login com Tabela Criada**
```
1. Execute supabase-admin-setup.sql
2. Acesse admin.html
3. Login: admin / admin123
✅ Deve autenticar via banco
```

### **Teste 2: Login sem Tabela (Fallback)**
```
1. NÃO execute o SQL (ou delete a tabela)
2. Acesse admin.html
3. Login: admin / admin123
✅ Deve autenticar via localStorage
```

### **Teste 3: Alterar Senha**
```
1. Faça login
2. Vá em Configurações
3. Altere senha para "novasenha123"
4. Faça logout
5. Login com nova senha
✅ Deve funcionar
```

### **Teste 4: Credenciais Inválidas**
```
1. Tente login: admin / senhaerrada
❌ Deve mostrar: "Usuário ou senha incorretos"
```

---

## 📊 Comparativo Antes/Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Autenticação** | Hardcoded (JS) | Banco de dados |
| **Segurança** | ⚠️ Baixa | ✅ Melhorada |
| **Persistência** | localStorage | Supabase |
| **Fallback** | ❌ Não | ✅ Sim |
| **Mensagens** | Genéricas | Específicas |
| **Loading** | ❌ Não | ✅ Sim |
| **Validações** | Básicas | Completas |

---

## 🔄 Migração de Instalações Antigas

### **Cenário 1: Já tem admin com senha customizada**

Se você alterou a senha admin no localStorage:

```javascript
// Senha atual no localStorage
const senhaAtual = localStorage.getItem('adminPassword');

// Após criar tabela, atualize no banco:
UPDATE admins 
SET password = 'sua_senha_customizada'
WHERE username = 'admin';
```

### **Cenário 2: Múltiplos admins**

Para adicionar mais administradores:

```sql
INSERT INTO admins (username, password) 
VALUES 
  ('admin2', 'senha123'),
  ('gerente', 'senha456');
```

---

## 🐛 Troubleshooting

### **Problema: "Erro ao fazer login"**

**Causa:** Tabela `admins` não existe  
**Solução:** Execute `supabase-admin-setup.sql` OU use fallback (funciona automaticamente)

### **Problema: "Usuário ou senha incorretos"**

**Causa:** Credenciais erradas  
**Solução:** 
- Verifique se digitou corretamente
- Padrão: `admin` / `admin123`
- Verifique no banco: `SELECT * FROM admins;`

### **Problema: Login funciona mas não carrega dashboard**

**Causa:** Erro ao carregar clientes  
**Solução:** 
- Verifique console (F12)
- Confirme que tabela `users` existe
- Verifique permissões RLS

### **Problema: Senha alterada não funciona**

**Causa:** Não sincronizou com banco  
**Solução:**
- Verifique se tabela `admins` existe
- Execute: `SELECT * FROM admins;`
- Se necessário, atualize manualmente

---

## 📝 Arquivos Modificados

### **Novos Arquivos:**
- ✅ `supabase-admin-setup.sql` - Script de criação da tabela
- ✅ `ADMIN_AUTH_SETUP.md` - Este guia

### **Arquivos Atualizados:**
- ✅ `config.js` - Adicionados métodos de autenticação
- ✅ `admin-supabase.js` - Login usa banco de dados
- ✅ Sincronizado em `www/`

---

## ✅ Checklist de Instalação

- [ ] Executar `supabase-admin-setup.sql` no Supabase
- [ ] Verificar tabela criada: `SELECT * FROM admins;`
- [ ] Testar login: admin / admin123
- [ ] Testar alterar senha
- [ ] Testar logout e login novamente
- [ ] Verificar console sem erros (F12)
- [ ] Testar em mobile/desktop
- [ ] Documentar senha customizada (se alterada)

---

## 🚀 Deploy

### **Variáveis de Ambiente (Vercel/Netlify)**

Se estiver usando Vercel ou Netlify, configure:

```env
NEXT_PUBLIC_SUPABASE_URL=https://crpewmsqskavzrfgmvkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Nota:** As credenciais já estão em `config.js`, mas em produção devem estar em variáveis de ambiente.

---

## 📞 Suporte

**Dúvidas?**
- Consulte este guia
- Verifique console do navegador (F12)
- Teste com credenciais padrão: `admin` / `admin123`

**Problemas Persistentes?**
- Verifique se Supabase está online
- Confirme URL e ANON_KEY corretos
- Teste fallback (funciona sem tabela)

---

**Versão:** 3.1  
**Data:** Janeiro 2025  
**Status:** ✅ Autenticação Corrigida  
**Compatibilidade:** Backward compatible (funciona com/sem tabela)
