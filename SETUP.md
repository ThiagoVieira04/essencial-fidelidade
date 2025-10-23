# 🚀 Setup Completo - Essencial Fidelidade

## 📊 **1. Configurar Supabase (Banco Gratuito)**

### Criar Conta
1. Acesse [supabase.com](https://supabase.com)
2. Crie conta gratuita
3. Crie novo projeto

### Configurar Banco
1. No painel Supabase, vá em **SQL Editor**
2. Execute o arquivo `supabase-setup.sql`
3. Copie **URL** e **anon key** do projeto

### Configurar App
1. Abra `config.js`
2. Substitua:
```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-aqui';
```

## 📱 **2. Gerar APK**

### Instalar Dependências
```bash
npm install -g @capacitor/cli
cd c:\PROJETOS\esssecial-fidelidade-main\esssecial-fidelidade-main
npm install
```

### Configurar Android
```bash
npx cap add android
npx cap sync
```

### Gerar APK
```bash
npx cap build android
```

**Ou abrir no Android Studio:**
```bash
npx cap open android
```

## 🧪 **3. Testar Localmente**

```bash
# Servidor simples
python -m http.server 8000

# Ou com Node.js
npx serve Front-end/public
```

## 🔑 **4. Credenciais**

- **Admin**: admin / admin123
- **Teste**: Cadastre clientes normalmente

## ⚡ **5. Funcionalidades**

✅ Banco de dados real (Supabase)  
✅ APK para Android  
✅ Sem Service Worker  
✅ Interface responsiva  
✅ Painel administrativo completo