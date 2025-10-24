# 🔧 Correção: Campos de Input no Android

## 🐛 Problema Identificado

Ao testar o APK no BlueStacks (emulador Android), os campos de login não recebiam texto digitado. O teclado virtual aparecia, mas os campos permaneciam inativos.

## 🔍 Causas Raiz

1. **Z-index elevado no botão de senha**: O botão `.password-toggle` estava com `z-index: 10`, sobrepondo o campo de input
2. **Event.preventDefault() bloqueando inputs**: Os eventos `click` com `preventDefault()` estavam impedindo a interação natural
3. **Falta de propriedades CSS para Android**: Ausência de `user-select` e `touch-action` nos inputs
4. **Configurações do Capacitor**: Faltavam configurações específicas para WebView Android

## ✅ Correções Aplicadas

### 1. **style.css**
- Reduzido `z-index` do `.password-toggle` de `10` para `1`
- Adicionado `pointer-events: auto` no botão
- Adicionado `-webkit-user-select: text` e `user-select: text` nos inputs
- Adicionado `touch-action: manipulation` para melhor resposta ao toque
- Aumentado `padding-right` do input de senha para evitar sobreposição

### 2. **script-supabase.js**
- Substituído evento `click` por `touchstart` nos botões de mostrar/ocultar senha
- Removido `event.preventDefault()` que bloqueava a interação
- Mantido apenas `event.stopPropagation()` para evitar propagação
- Adicionado `{ passive: true }` nos listeners para melhor performance

### 3. **index.html**
- Adicionado `user-scalable=yes` na meta viewport
- Adicionado `<meta name="mobile-web-app-capable" content="yes" />`

### 4. **capacitor.config.json**
- Adicionado `webContentsDebuggingEnabled: true` para debug
- Adicionado `androidScheme: "https"` no server config

## 📦 APK Gerado

**Localização**: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🧪 Como Testar

1. **No BlueStacks**:
   ```bash
   # Instalar o APK
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Em dispositivo físico**:
   - Transferir o APK via USB ou email
   - Habilitar "Fontes desconhecidas" nas configurações
   - Instalar e testar

3. **Verificações**:
   - ✅ Teclado abre ao tocar no campo
   - ✅ Texto é inserido normalmente
   - ✅ Botão de mostrar/ocultar senha funciona
   - ✅ Navegação entre campos funciona
   - ✅ Login/cadastro funcionam corretamente

## 🔄 Comandos para Rebuild

```bash
# Sincronizar alterações
npx cap sync android

# Gerar novo APK
cd android
gradlew assembleDebug
```

## 📝 Commit Realizado

```
fix(android): corrigir campos de input que não recebem texto no APK

- Ajustado z-index do botão de senha para não sobrepor input
- Substituído eventos click por touchstart para Android
- Removido preventDefault que bloqueava digitação
- Adicionado propriedades CSS para melhor suporte mobile
- Atualizado configurações do Capacitor para WebView
```

## 🎯 Resultado Esperado

Os campos de input agora devem:
- Responder ao toque normalmente
- Receber texto do teclado virtual
- Permitir navegação entre campos
- Funcionar o botão de mostrar/ocultar senha
- Manter compatibilidade com web e PWA
