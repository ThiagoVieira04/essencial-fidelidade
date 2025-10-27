# 💚 Essencial Fidelidade

> **Cartão de fidelidade digital moderno** para a clínica **Essencial Saúde e Estética**

Um sistema completo de fidelização digital que permite aos clientes acumular selos virtuais e receber recompensas automáticas. Desenvolvido como **Progressive Web App (PWA)** com suporte nativo para Android via **Capacitor**.

---

## ✨ **Destaques do Projeto**

🎯 **Sistema de Recompensas**: 10 selos = 1 brinde automático  
📱 **App Nativo**: APK para Android com Capacitor  
🌐 **PWA Completo**: Funciona offline e pode ser instalado  
🔒 **Painel Admin**: Gerenciamento completo de clientes e selos  
☁️ **Banco Real**: Integração com Supabase (PostgreSQL)  
🎨 **UI Moderna**: Interface responsiva e intuitiva  
🌙 **Dark Mode**: Tema claro/escuro com persistência local  

---

## 🚀 **Tecnologias**

| Frontend | Backend | Mobile | Deploy |
|----------|---------|--------|--------|
| HTML5/CSS3/JS | Supabase | Capacitor | Supabase Hosting |
| PWA | PostgreSQL | Android Studio | GitHub Actions |
| Service Worker | Real-time DB | Gradle | - |

---

## 📱 **Funcionalidades**

### 👤 **Para Clientes**
- ✅ Cadastro e login seguro
- ✅ Cartão digital com 10 espaços para selos
- ✅ Notificação automática de recompensa
- ✅ Interface otimizada para mobile
- ✅ Funciona offline (PWA)
- ✅ Dark Mode / Light Mode

### 🔧 **Para Administradores**
- ✅ Painel administrativo completo
- ✅ Gerenciamento de clientes (CRUD)
- ✅ Adicionar/remover selos individualmente
- ✅ Resetar cartões de fidelidade
- ✅ Busca e filtros avançados
- ✅ Dashboard em tempo real
- ✅ Dark Mode / Light Mode

---

## 🏗️ **Arquitetura do Projeto**

```
essencial-fidelidade/
├── 📱 android/                 # App nativo Android
│   ├── app/src/main/assets/    # Assets do app
│   └── build.gradle            # Configurações Android
├── 🌐 Front-end/public/        # Código fonte web
│   ├── index.html              # Página principal
│   ├── admin.html              # Painel administrativo
│   ├── script-supabase.js      # Lógica do cliente
│   ├── admin-supabase.js       # Lógica do admin
│   ├── config.js               # Configurações Supabase
│   ├── theme.css               # Estilos Dark/Light Mode
│   ├── theme.js                # Gerenciador de temas
│   └── assets/                 # Imagens e ícones
├── 📦 www/                     # Build para Capacitor
├── ⚙️ capacitor.config.json    # Configurações do app
├── 🗄️ supabase-setup.sql       # Schema do banco
└── 📋 SETUP.md                 # Guia de instalação
```

---

## 🛠️ **Instalação Rápida**

### **1. Clonar Repositório**
```bash
git clone https://github.com/ThiagoVieira04/essencial-fidelidade.git
cd essencial-fidelidade
```

### **2. Configurar Supabase**
```bash
# 1. Criar projeto em supabase.com
# 2. Executar supabase-setup.sql no SQL Editor
# 3. Copiar URL e ANON_KEY para config.js
```

### **3. Instalar Dependências**
```bash
npm install
npx cap add android
```

### **4. Testar Localmente**
```bash
# Servidor local
npx serve Front-end/public

# Ou Python
python -m http.server 8000
```

### **5. Gerar APK**
```bash
npx cap sync
npx cap build android
# Ou: npx cap open android (Android Studio)
```

---

## 🔐 **Credenciais de Teste**

| Tipo | Usuário | Senha |
|------|---------|-------|
| **Admin** | `admin` | `admin123` |
| **Cliente** | Cadastre-se normalmente | - |

---

## 📊 **Banco de Dados**

### **Tabelas Principais**
```sql
users (id, name, email, phone, password, created_at)
stamps (id, user_id, created_at)
```

### **Recursos Supabase**
- ✅ PostgreSQL em tempo real
- ✅ Row Level Security (RLS)
- ✅ API REST automática
- ✅ Plano gratuito (50MB)

---

## 🎨 **Screenshots**

| Tela de Login | Cartão Fidelidade | Painel Admin |
|---------------|-------------------|--------------|
| ![Login](assets/logo.png) | ![Card](assets/logo.png) | ![Admin](assets/shirley%20logo%20(1).png) |

---

## 🚀 **Deploy**

### **Web (Supabase Hosting)**
```bash
# Configurar no painel Supabase
# Upload da pasta Front-end/public/
```

### **Android (Google Play)**
```bash
npx cap build android --prod
# Gerar APK assinado no Android Studio
```

---

## 🔧 **Configurações Avançadas**

### **PWA Manifest**
```json
{
  "name": "Essencial Saúde e Estética",
  "short_name": "Essencial",
  "display": "standalone",
  "theme_color": "#3a7a44"
}
```

### **Capacitor Config**
```json
{
  "appId": "com.essencial.fidelidade",
  "appName": "Essencial Fidelidade",
  "webDir": "Front-end/public"
}
```

---

## 🛡️ **Segurança**

- 🔒 Senhas não armazenadas em texto plano
- 🔐 Validação de admin no backend
- 🚫 RLS habilitado no Supabase
- 📝 Logs de auditoria automáticos
- 🔑 Chaves sensíveis em `.env` (gitignore)

---

## 📈 **Roadmap**

- [x] 🌙 Modo escuro
- [ ] 🔔 Notificações push
- [ ] 📧 Integração com e-mail
- [ ] 📊 Dashboard de analytics
- [ ] 🎁 Sistema de cupons
- [ ] 🌍 Internacionalização

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 **Autor**

**Thiago Vieira**  
📍 Magé, RJ – Brasil  
🔗 [GitHub](https://github.com/ThiagoVieira04)  
📧 [Contato](tsmv04@hotmail.com)  

---

## 🙏 **Agradecimentos**

- **Essencial Saúde e Estética** pela confiança no projeto


---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

[![GitHub stars](https://img.shields.io/github/stars/ThiagoVieira04/essencial-fidelidade?style=social)](https://github.com/ThiagoVieira04/essencial-fidelidade)
[![GitHub forks](https://img.shields.io/github/forks/ThiagoVieira04/essencial-fidelidade?style=social)](https://github.com/ThiagoVieira04/essencial-fidelidade)

</div>