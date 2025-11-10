# 🚀 Keep-Alive Supabase - Configuração

## ✅ O que foi implementado

### 1. GitHub Actions (Automático)
- **Arquivo**: `.github/workflows/keep-supabase-active.yml`
- **Função**: Faz ping no Supabase a cada 6 dias
- **Status**: Executa automaticamente quando você fizer push para GitHub

### 2. Keep-Alive no Código (Automático)
- **Arquivo**: `Front-end/public/keep-alive.js`
- **Função**: Mantém conexão ativa enquanto usuário usa o app
- **Status**: Já integrado em `index.html` e `admin.html`

## 📋 Como ativar

### Passo 1: Fazer Push para GitHub
```bash
cd c:\PROJETOS\esssecial-fidelidade-main\esssecial-fidelidade-main
git add .
git commit -m "Adiciona keep-alive para Supabase"
git push
```

### Passo 2: Verificar GitHub Actions
1. Acesse seu repositório no GitHub
2. Vá em **Actions**
3. Você verá o workflow "Keep Supabase Active"
4. Pode executar manualmente clicando em "Run workflow"

## 🎯 Como funciona

### GitHub Actions
- Executa **automaticamente a cada 6 dias**
- Faz uma requisição simples ao banco
- Mantém o projeto ativo no Supabase

### Keep-Alive no App
- Executa quando usuário abre o app
- Faz ping a cada 6 dias enquanto app está aberto
- Backup adicional de segurança

## ✅ Pronto!

Seu projeto **NUNCA** será pausado no Supabase (plano gratuito).

## 🔍 Testar manualmente

No GitHub:
1. Vá em **Actions**
2. Selecione "Keep Supabase Active"
3. Clique em "Run workflow"
4. Clique em "Run workflow" novamente

## 📊 Monitorar

- GitHub Actions mostra logs de cada execução
- Console do navegador mostra "✓ Supabase ativo" quando funciona
