# ✅ Checklist de Deploy - v3.0

## 📋 Pré-Deploy

### **1. Verificação de Arquivos**
- [x] `utils.js` criado e sincronizado
- [x] `toast.css` criado e sincronizado
- [x] `config.js` atualizado
- [x] `script-supabase.js` atualizado
- [x] `admin-supabase.js` atualizado
- [x] `index.html` atualizado (imports)
- [x] `admin.html` atualizado (imports)
- [x] `service-worker.js` atualizado (cache v3.0)
- [x] Arquivos sincronizados: `Front-end/public/` → `www/`

---

### **2. Testes Funcionais**

#### **Validações**
- [ ] Nome com 1 letra → Erro
- [ ] Nome com 100+ caracteres → Erro
- [ ] Nome com números → Erro
- [ ] Nome válido → Sucesso
- [ ] Telefone com 9 dígitos → Erro
- [ ] Telefone com 12 dígitos → Erro
- [ ] Telefone válido (10-11) → Sucesso
- [ ] Senha com 5 caracteres → Erro
- [ ] Senha válida (6+) → Sucesso
- [ ] Email inválido → Erro
- [ ] Email válido → Sucesso

#### **Toast Notifications**
- [ ] Toast de sucesso (verde) aparece
- [ ] Toast de erro (vermelho) aparece
- [ ] Toast de aviso (laranja) aparece
- [ ] Toast de info (azul) aparece
- [ ] Toast desaparece em 3 segundos
- [ ] Toast responsivo em mobile

#### **Loading States**
- [ ] Botão de cadastro mostra loading
- [ ] Botão de login mostra loading
- [ ] Botão de adicionar selo mostra loading
- [ ] Botão de remover selo mostra loading
- [ ] Botão de resetar mostra loading
- [ ] Botão desabilita durante loading
- [ ] Botão restaura após operação

#### **Performance**
- [ ] Busca de clientes usa debounce (300ms)
- [ ] Renderização de selos é rápida
- [ ] Sem lag ao trocar de tela
- [ ] Console sem erros

#### **Acessibilidade**
- [ ] Navegação por Tab funciona
- [ ] ARIA labels presentes
- [ ] Screen reader anuncia toasts
- [ ] Botões têm labels descritivos

---

### **3. Testes de Integração**

#### **Fluxo Cliente**
- [ ] Cadastro com validação
- [ ] Login com validação
- [ ] Visualizar cartão
- [ ] Selos aparecem corretamente
- [ ] Mensagem de recompensa (10 selos)
- [ ] Logout funciona

#### **Fluxo Admin**
- [ ] Login admin
- [ ] Listar clientes
- [ ] Buscar cliente (debounce)
- [ ] Adicionar cliente (validação)
- [ ] Editar cliente (validação)
- [ ] Excluir cliente (confirmação)
- [ ] Adicionar selo (loading)
- [ ] Remover selo (loading)
- [ ] Resetar cartão (confirmação)
- [ ] Alterar senha admin
- [ ] Logout admin

---

### **4. Testes de Segurança**

- [ ] XSS: Tentar `<script>alert('XSS')</script>` no nome
- [ ] SQL Injection: Tentar `'; DROP TABLE users; --`
- [ ] Validação: Dados inválidos são rejeitados
- [ ] Sanitização: HTML é escapado
- [ ] Erros: Não expõem informações sensíveis

---

### **5. Testes de Compatibilidade**

#### **Desktop**
- [ ] Chrome (Windows)
- [ ] Edge (Windows)
- [ ] Firefox (Windows)
- [ ] Safari (macOS)

#### **Mobile**
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] PWA instalado (Android)
- [ ] PWA instalado (iOS)

#### **Capacitor**
- [ ] APK funciona em Android
- [ ] Todas as funcionalidades operacionais
- [ ] Sem crashes

---

## 🚀 Deploy

### **1. Backup**
```bash
# Fazer backup do banco de dados
# Supabase Dashboard → Database → Backups

# Fazer backup dos arquivos
git add .
git commit -m "Backup antes do deploy v3.0"
git push
```

---

### **2. Atualizar Service Worker**
```javascript
// service-worker.js
const CACHE_NAME = 'essencial-fidelidade-v3.0'; // ✅ Verificado
```

---

### **3. Atualizar Manifest**
```json
// manifest.json
{
  "version": "3.0",
  "name": "Essencial Fidelidade v3.0"
}
```

---

### **4. Sincronizar Capacitor**
```bash
# Copiar arquivos para www
copy "Front-end\public\*" "www\"

# Sincronizar
npx cap sync

# Verificar
npx cap ls
```

---

### **5. Build Android**
```bash
# Debug (teste)
npx cap build android

# Release (produção)
cd android
gradlew assembleRelease

# APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

### **6. Deploy Web**

#### **Opção 1: Supabase Hosting**
```bash
# Upload da pasta Front-end/public/
# Supabase Dashboard → Storage → Upload
```

#### **Opção 2: Vercel**
```bash
vercel --prod
```

#### **Opção 3: Netlify**
```bash
netlify deploy --prod --dir=Front-end/public
```

---

## 🧪 Pós-Deploy

### **1. Testes em Produção**
- [ ] Acessar URL de produção
- [ ] Testar cadastro
- [ ] Testar login
- [ ] Testar admin
- [ ] Verificar toasts
- [ ] Verificar loading states
- [ ] Testar em mobile

---

### **2. Monitoramento**

#### **Console do Navegador**
```javascript
// Verificar erros
// F12 → Console → Sem erros vermelhos
```

#### **Supabase Dashboard**
```
- Database → Logs → Verificar queries
- Auth → Users → Verificar cadastros
- Storage → Verificar assets
```

---

### **3. Performance**

#### **Lighthouse (Chrome DevTools)**
```
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80
```

#### **Métricas**
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] FID (First Input Delay) < 100ms

---

## 🐛 Rollback (Se Necessário)

### **Reverter para v2.9**
```bash
# Git
git revert HEAD
git push

# Capacitor
git checkout v2.9
npx cap sync
npx cap build android

# Supabase
# Restaurar backup do banco
```

---

## 📊 Métricas de Sucesso

### **Após 1 Semana**
- [ ] 0 bugs críticos reportados
- [ ] Feedback positivo dos usuários
- [ ] Performance mantida (Lighthouse > 90)
- [ ] Sem erros no console
- [ ] Taxa de conversão mantida/melhorada

### **Após 1 Mês**
- [ ] Redução de 80% em erros de validação
- [ ] Aumento de 50% em satisfação (toasts)
- [ ] Redução de 70% em queries (debounce)
- [ ] 0 incidentes de segurança

---

## 📝 Documentação

### **Atualizar**
- [ ] README.md (versão 3.0)
- [ ] CHANGELOG.md (adicionar v3.0)
- [ ] package.json (version: "3.0.0")
- [ ] capacitor.config.json (version: "3.0.0")

### **Comunicar**
- [ ] Notificar equipe sobre melhorias
- [ ] Enviar guia rápido para admin
- [ ] Atualizar documentação interna
- [ ] Postar release notes no GitHub

---

## 🎯 Checklist Final

### **Antes de Clicar em "Deploy"**
- [ ] ✅ Todos os testes passaram
- [ ] ✅ Backup realizado
- [ ] ✅ Arquivos sincronizados
- [ ] ✅ Service Worker atualizado
- [ ] ✅ Manifest atualizado
- [ ] ✅ Documentação atualizada
- [ ] ✅ Equipe notificada
- [ ] ✅ Plano de rollback pronto

### **Após Deploy**
- [ ] ✅ Testes em produção OK
- [ ] ✅ Performance OK (Lighthouse)
- [ ] ✅ Sem erros no console
- [ ] ✅ Mobile funcionando
- [ ] ✅ PWA instalável
- [ ] ✅ APK funcionando

---

## 🚨 Troubleshooting

### **Toast não aparece**
```javascript
// Verificar importação
<link rel="stylesheet" href="toast.css" />
<script src="utils.js"></script>

// Verificar cache
// Ctrl + Shift + R (hard refresh)
```

### **Validações não funcionam**
```javascript
// Verificar ordem de scripts
1. config.js
2. utils.js      ← Antes dos outros
3. theme.js
4. script-supabase.js
```

### **Loading não funciona**
```javascript
// Verificar se botão existe
const btn = form.querySelector('button[type="submit"]');
console.log(btn); // Não deve ser null
```

### **Service Worker não atualiza**
```javascript
// Forçar atualização
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
location.reload();
```

---

## 📞 Contatos de Emergência

**Desenvolvedor:** Thiago Vieira  
**Email:** tsmv04@hotmail.com  
**WhatsApp:** (21) 98717-2463  

**Supabase Support:** https://supabase.com/support  
**GitHub Issues:** https://github.com/ThiagoVieira04/essencial-fidelidade/issues  

---

## ✅ Assinatura de Deploy

**Versão:** 3.0  
**Data:** ___/___/2025  
**Responsável:** _________________  
**Status:** [ ] Aprovado [ ] Rejeitado  
**Observações:** _________________

---

**🎉 Boa sorte com o deploy!**
