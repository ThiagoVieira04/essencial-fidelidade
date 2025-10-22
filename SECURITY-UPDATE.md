# Atualização de Segurança - Sistema de Roles

## Mudanças Implementadas

### 1. Sistema de Roles
- Adicionada coluna `role` na tabela `users` (valores: 'user', 'admin')
- Usuários comuns recebem role 'user' por padrão
- Administrador tem role 'admin'

### 2. Validações Frontend
- **Botão de adicionar selo removido** para usuários comuns
- **Função addStamp bloqueada** para usuários não-admin
- **Validação de permissão** em todas as funções administrativas

### 3. Validações Backend
- **Database.addStamp()** agora requer parâmetro `adminId`
- **Política RLS** no Supabase para stamps (apenas admins podem inserir)
- **Função isAdmin()** para verificar permissões

### 4. Arquivos Modificados
- `config.js` - Adicionadas funções de validação
- `script.js` - Removido botão e bloqueada função para usuários
- `script-supabase.js` - Mesmas validações para versão Supabase
- `admin.js` - Validação de permissão antes de adicionar selos
- `admin-supabase.js` - Validação de permissão para versão Supabase

### 5. Banco de Dados
- Execute `database-update.sql` para aplicar as mudanças no Supabase

## Como Funciona Agora

### Para Usuários Comuns:
- ✅ Podem ver seus selos
- ✅ Podem fazer login/logout
- ❌ **NÃO podem adicionar selos**
- ❌ Botão "Adicionar Carimbo" não aparece

### Para Administradores:
- ✅ Podem adicionar selos via painel admin
- ✅ Podem gerenciar usuários
- ✅ Têm acesso completo ao sistema
- ✅ Validação dupla (frontend + backend)

## Segurança
- **Frontend**: Botão oculto + função bloqueada
- **Backend**: Validação de role + RLS policies
- **Dupla proteção**: Mesmo que alguém tente forçar via API, será bloqueado