# 🌙 Dark Mode / Light Mode

## Implementação

O projeto agora possui suporte completo para **Dark Mode** e **Light Mode** com persistência local.

---

## ✨ Funcionalidades

- ✅ Alternância entre tema claro e escuro
- ✅ Botão flutuante fixo no canto inferior direito
- ✅ Persistência da preferência em `localStorage`
- ✅ Compatibilidade total com web app e app nativo Android
- ✅ Transições suaves entre temas
- ✅ Contrastes apropriados para acessibilidade
- ✅ Ícones intuitivos (🌙 para ativar dark mode, ☀️ para light mode)

---

## 📁 Arquivos Criados

### `theme.css`
Define as variáveis CSS para ambos os temas:
- **Light Mode**: Cores claras padrão
- **Dark Mode**: Cores escuras com bom contraste

### `theme.js`
Gerencia a lógica de alternância e persistência:
- Carrega tema salvo ao iniciar
- Cria botão flutuante automaticamente
- Salva preferência no `localStorage`
- Atualiza ícone do botão dinamicamente

---

## 🎨 Variáveis de Tema

### Light Mode (Padrão)
```css
--bg-primary: #f9f9f9
--bg-secondary: white
--text-primary: #333
--border-color: #ccc
```

### Dark Mode
```css
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--text-primary: #e0e0e0
--border-color: #444
```

---

## 🔧 Como Funciona

1. **Carregamento**: Ao abrir o app, o tema salvo é carregado do `localStorage`
2. **Alternância**: Clique no botão flutuante para alternar entre temas
3. **Persistência**: A preferência é salva automaticamente
4. **Sincronização**: O tema é aplicado em todas as páginas (cliente e admin)

---

## 📱 Compatibilidade

- ✅ **Web App**: Funciona perfeitamente em navegadores
- ✅ **PWA**: Mantém tema após instalação
- ✅ **Android Nativo**: Totalmente compatível via Capacitor
- ✅ **Responsivo**: Botão se adapta a telas menores

---

## 🚀 Deploy

### Web
Os arquivos `theme.css` e `theme.js` já estão incluídos em:
- `Front-end/public/index.html`
- `Front-end/public/admin.html`

### Android (Capacitor)
Os arquivos também foram copiados para:
- `www/theme.css`
- `www/theme.js`
- `www/index.html`
- `www/admin.html`

Para gerar novo APK com Dark Mode:
```bash
npx cap sync
npx cap build android
```

---

## 🎯 Acessibilidade

O Dark Mode foi implementado seguindo boas práticas:
- Contraste adequado entre texto e fundo
- Cores mantêm hierarquia visual
- Botão com `aria-label` descritivo
- Transições suaves para evitar fadiga visual

---

## 💡 Uso

Não é necessário configuração adicional. O Dark Mode está ativo e pronto para uso:

1. Abra o app (web ou nativo)
2. Clique no botão flutuante no canto inferior direito
3. O tema será alternado e salvo automaticamente

---

## 🔄 Sincronização

A preferência de tema é salva em `localStorage` com a chave `theme`:
- `'light'`: Tema claro
- `'dark'`: Tema escuro

Isso garante que o tema escolhido seja mantido entre sessões.
