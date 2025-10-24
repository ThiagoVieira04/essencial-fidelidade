# 🚀 Deploy no Netlify

## Passo a Passo

### 1. Criar conta no Netlify
- Acesse: https://www.netlify.com/
- Faça login com GitHub

### 2. Deploy via GitHub (Recomendado)

**Opção A: Conectar repositório**
1. No Netlify, clique em "Add new site" → "Import an existing project"
2. Escolha "GitHub" e autorize
3. Selecione o repositório `essencial-fidelidade`
4. Configurações automáticas (já configurado no `netlify.toml`):
   - Build command: `echo 'No build required'`
   - Publish directory: `Front-end/public`
5. Clique em "Deploy site"

### 3. Deploy via Drag & Drop (Alternativa)

1. No Netlify, clique em "Add new site" → "Deploy manually"
2. Arraste a pasta `Front-end/public` para a área de upload
3. Aguarde o deploy

### 4. Configurar domínio customizado (Opcional)

1. No painel do site, vá em "Domain settings"
2. Clique em "Add custom domain"
3. Siga as instruções para configurar DNS

## ✅ Pronto!

Seu app estará disponível em: `https://seu-site.netlify.app`

## 🔧 Comandos úteis

```bash
# Instalar Netlify CLI (opcional)
npm install -g netlify-cli

# Deploy via CLI
netlify deploy --prod --dir=Front-end/public
```

## 📝 Notas

- O Supabase já está configurado no `config.js`
- O app funciona como PWA instalável
- SSL/HTTPS automático pelo Netlify
- Deploy contínuo configurado (push = deploy automático)
