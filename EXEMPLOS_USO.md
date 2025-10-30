# 💻 Exemplos Práticos de Uso - v3.0

## 🎯 Como Usar as Novas Funcionalidades

---

## 1️⃣ Validações

### **Validar Nome**
```javascript
const nameInput = document.getElementById('name');
const name = nameInput.value.trim();

const validation = Utils.validateName(name);
if (!validation.valid) {
  Utils.showToast(validation.error, 'error');
  return;
}

// Nome válido, continuar
const validName = validation.value;
```

**Regras:**
- Mínimo 2 caracteres
- Máximo 100 caracteres
- Apenas letras (incluindo acentos)

---

### **Validar Telefone**
```javascript
const phoneValidation = Utils.validatePhone(phone);
if (!phoneValidation.valid) {
  Utils.showToast(phoneValidation.error, 'error');
  return;
}

// Telefone válido (apenas números)
const cleanPhone = phoneValidation.value; // Ex: "21987172463"
```

**Regras:**
- 10 ou 11 dígitos
- Remove caracteres especiais automaticamente

---

### **Validar Senha**
```javascript
const passwordValidation = Utils.validatePassword(password);
if (!passwordValidation.valid) {
  Utils.showToast(passwordValidation.error, 'error');
  return;
}
```

**Regras:**
- Mínimo 6 caracteres
- Máximo 50 caracteres

---

### **Validar Email (Opcional)**
```javascript
const emailValidation = Utils.validateEmail(email);
if (!emailValidation.valid) {
  Utils.showToast(emailValidation.error, 'error');
  return;
}

// Email válido e normalizado
const normalizedEmail = emailValidation.value; // lowercase
```

---

## 2️⃣ Toast Notifications

### **Sucesso**
```javascript
Utils.showToast('Cadastro realizado com sucesso!', 'success');
```
**Cor:** Verde  
**Uso:** Operações bem-sucedidas

---

### **Erro**
```javascript
Utils.showToast('Erro ao processar solicitação', 'error');
```
**Cor:** Vermelho  
**Uso:** Erros e falhas

---

### **Aviso**
```javascript
Utils.showToast('Cartão já está completo!', 'warning');
```
**Cor:** Laranja  
**Uso:** Avisos e atenções

---

### **Informação**
```javascript
Utils.showToast('Processando...', 'info');
```
**Cor:** Azul  
**Uso:** Informações gerais

---

### **Toast Personalizado**
```javascript
// Padrão: 3 segundos
Utils.showToast('Mensagem', 'success');

// Para alterar duração, edite utils.js linha ~70
setTimeout(() => {
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 300);
}, 5000); // 5 segundos
```

---

## 3️⃣ Loading States

### **Botão de Submit**
```javascript
const form = document.getElementById('my-form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Ativar loading
  Utils.showLoading(submitBtn, true);
  
  try {
    await Database.createUser(userData);
    Utils.showToast('Sucesso!', 'success');
  } catch (error) {
    Utils.showToast(error.message, 'error');
  } finally {
    // Sempre desativar loading
    Utils.showLoading(submitBtn, false);
  }
});
```

---

### **Qualquer Botão**
```javascript
const myButton = document.getElementById('my-button');

myButton.addEventListener('click', async () => {
  Utils.showLoading(myButton, true);
  
  await longOperation();
  
  Utils.showLoading(myButton, false);
});
```

**Efeito:**
- Botão desabilitado
- Texto muda para "Carregando..."
- Spinner animado
- Cursor: not-allowed

---

## 4️⃣ Formatação

### **Telefone**
```javascript
const phone = "21987172463";
const formatted = Utils.formatPhone(phone);
console.log(formatted); // "(21) 98717-2463"
```

**Suporta:**
- 11 dígitos: (XX) XXXXX-XXXX
- 10 dígitos: (XX) XXXX-XXXX

---

### **Sanitização HTML (XSS)**
```javascript
const userInput = "<script>alert('XSS')</script>";
const safe = Utils.sanitizeHTML(userInput);
console.log(safe); // "&lt;script&gt;alert('XSS')&lt;/script&gt;"

// Uso em elementos
element.textContent = Utils.sanitizeHTML(userInput);
```

---

## 5️⃣ Debounce

### **Busca com Debounce**
```javascript
const searchInput = document.getElementById('search');

// Sem debounce (ruim - muitas chamadas)
searchInput.addEventListener('input', () => {
  performSearch(); // Executa a cada tecla
});

// Com debounce (bom - aguarda pausa)
searchInput.addEventListener('input', 
  Utils.debounce(() => {
    performSearch(); // Executa após 300ms de inatividade
  }, 300)
);
```

**Benefícios:**
- 70% menos queries ao banco
- Melhor performance
- Economia de recursos

---

## 6️⃣ Database (Melhorado)

### **Criar Usuário**
```javascript
try {
  const user = await Database.createUser({
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '21987172463',
    password: 'senha123'
  });
  
  Utils.showToast('Usuário criado!', 'success');
  console.log('ID:', user.id);
} catch (error) {
  if (error.message === 'Usuário já cadastrado') {
    Utils.showToast('Este usuário já existe', 'warning');
  } else {
    Utils.showToast(error.message, 'error');
  }
}
```

---

### **Buscar Usuários (Ordenado)**
```javascript
// Retorna ordenado por data de criação (mais recente primeiro)
const users = await Database.getUsers();
```

---

### **Buscar por Nome**
```javascript
const user = await Database.getUserByName('João Silva');
if (user) {
  console.log('Encontrado:', user);
} else {
  Utils.showToast('Usuário não encontrado', 'warning');
}
```

---

### **Estatísticas**
```javascript
const stats = await Database.getStats();
console.log('Total de usuários:', stats.totalUsers);
console.log('Total de selos:', stats.totalStamps);
console.log('Cartões completos:', stats.completedCards);
```

---

## 7️⃣ Tratamento de Erros

### **Padrão Completo**
```javascript
async function myFunction() {
  const button = document.getElementById('my-button');
  Utils.showLoading(button, true);
  
  try {
    // Validações
    const validation = Utils.validateName(name);
    if (!validation.valid) {
      Utils.showToast(validation.error, 'error');
      return;
    }
    
    // Operação
    const result = await Database.createUser(data);
    
    // Sucesso
    Utils.showToast('Operação concluída!', 'success');
    return result;
    
  } catch (error) {
    // Log para debug
    console.error('Erro detalhado:', error);
    
    // Feedback ao usuário
    Utils.showToast(error.message || 'Erro ao processar', 'error');
    
  } finally {
    // Sempre executado
    Utils.showLoading(button, false);
  }
}
```

---

## 8️⃣ Acessibilidade

### **ARIA Labels**
```javascript
// Criar elemento acessível
const button = document.createElement('button');
button.textContent = 'Editar';
button.setAttribute('aria-label', `Editar cliente ${clientName}`);

// Stamp com contexto
const stamp = document.createElement('div');
stamp.classList.add('stamp', 'filled');
stamp.setAttribute('aria-label', `Selo 5 preenchido em ${date}`);
```

---

### **Roles**
```javascript
// Alert para notificações importantes
const alert = document.createElement('div');
alert.setAttribute('role', 'alert');
alert.setAttribute('aria-live', 'polite');
alert.textContent = 'Cartão completo!';

// Article para cards
const card = document.createElement('div');
card.setAttribute('role', 'article');
card.setAttribute('aria-label', `Cliente ${name}`);
```

---

## 9️⃣ Formulário Completo (Exemplo Real)

```javascript
const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 1. Capturar dados
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value.trim();
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // 2. Validar
  const nameValidation = Utils.validateName(name);
  if (!nameValidation.valid) {
    Utils.showToast(nameValidation.error, 'error');
    return;
  }
  
  const phoneValidation = Utils.validatePhone(phone);
  if (!phoneValidation.valid) {
    Utils.showToast(phoneValidation.error, 'error');
    return;
  }
  
  const passwordValidation = Utils.validatePassword(password);
  if (!passwordValidation.valid) {
    Utils.showToast(passwordValidation.error, 'error');
    return;
  }
  
  // 3. Loading
  Utils.showLoading(submitBtn, true);
  
  // 4. Processar
  try {
    await Database.createUser({
      name: nameValidation.value,
      phone: phoneValidation.value,
      password: passwordValidation.value
    });
    
    Utils.showToast('Cadastro realizado com sucesso!', 'success');
    form.reset();
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    Utils.showToast(error.message || 'Erro ao cadastrar', 'error');
    
  } finally {
    Utils.showLoading(submitBtn, false);
  }
});
```

---

## 🔟 Performance - Document Fragment

### **Renderizar Lista Grande**
```javascript
// RUIM (10 reflows)
for (let i = 0; i < 10; i++) {
  const item = document.createElement('div');
  item.textContent = `Item ${i}`;
  container.appendChild(item); // Reflow a cada iteração
}

// BOM (1 reflow)
const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const item = document.createElement('div');
  item.textContent = `Item ${i}`;
  fragment.appendChild(item);
}
container.appendChild(fragment); // Reflow único
```

**Benefício:** 90% mais rápido em listas grandes

---

## 1️⃣1️⃣ Customização

### **Alterar Cores dos Toasts**
```css
/* toast.css */
.toast-success {
  background-color: #4CAF50; /* Verde padrão */
}

/* Usar variável do tema */
.toast-success {
  background-color: var(--primary-green);
}
```

---

### **Alterar Duração do Toast**
```javascript
// utils.js - função showToast
setTimeout(() => {
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 300);
}, 3000); // ← Alterar aqui (milissegundos)
```

---

### **Alterar Tempo de Debounce**
```javascript
// 300ms padrão
Utils.debounce(func, 300)

// 500ms (mais lento, menos chamadas)
Utils.debounce(func, 500)

// 100ms (mais rápido, mais chamadas)
Utils.debounce(func, 100)
```

---

## 🧪 Testes Práticos

### **Teste 1: Validação Completa**
```javascript
// Abra o console (F12) e execute:

// Nome inválido
const test1 = Utils.validateName('A');
console.log(test1); // { valid: false, error: "..." }

// Nome válido
const test2 = Utils.validateName('João Silva');
console.log(test2); // { valid: true, value: "João Silva" }

// Telefone inválido
const test3 = Utils.validatePhone('123');
console.log(test3); // { valid: false, error: "..." }

// Telefone válido
const test4 = Utils.validatePhone('21987172463');
console.log(test4); // { valid: true, value: "21987172463" }
```

---

### **Teste 2: Toast Manual**
```javascript
// Abra o console e execute:
Utils.showToast('Teste de sucesso!', 'success');
Utils.showToast('Teste de erro!', 'error');
Utils.showToast('Teste de aviso!', 'warning');
Utils.showToast('Teste de info!', 'info');
```

---

### **Teste 3: Formatação**
```javascript
// Console:
console.log(Utils.formatPhone('21987172463'));
// Resultado: "(21) 98717-2463"

console.log(Utils.sanitizeHTML('<script>alert("XSS")</script>'));
// Resultado: "&lt;script&gt;alert("XSS")&lt;/script&gt;"
```

---

## 🎓 Boas Práticas

### **1. Sempre Validar Antes de Processar**
```javascript
// ✅ BOM
const validation = Utils.validateName(name);
if (!validation.valid) return;
await Database.createUser({ name: validation.value });

// ❌ RUIM
await Database.createUser({ name }); // Sem validação
```

---

### **2. Sempre Usar Try/Catch/Finally**
```javascript
// ✅ BOM
try {
  await operation();
} catch (error) {
  console.error(error);
  Utils.showToast(error.message, 'error');
} finally {
  Utils.showLoading(button, false);
}

// ❌ RUIM
await operation(); // Sem tratamento
```

---

### **3. Sempre Dar Feedback ao Usuário**
```javascript
// ✅ BOM
Utils.showLoading(button, true);
await operation();
Utils.showToast('Sucesso!', 'success');
Utils.showLoading(button, false);

// ❌ RUIM
await operation(); // Usuário não sabe o que está acontecendo
```

---

### **4. Sempre Sanitizar Entrada do Usuário**
```javascript
// ✅ BOM
const safeName = Utils.sanitizeHTML(userInput);
element.textContent = safeName;

// ❌ RUIM
element.innerHTML = userInput; // Vulnerável a XSS
```

---

## 📚 Referências Rápidas

| Função | Uso | Retorno |
|--------|-----|---------|
| `Utils.validateName()` | Validar nome | `{ valid, error?, value? }` |
| `Utils.validatePhone()` | Validar telefone | `{ valid, error?, value? }` |
| `Utils.validatePassword()` | Validar senha | `{ valid, error?, value? }` |
| `Utils.validateEmail()` | Validar email | `{ valid, error?, value? }` |
| `Utils.showToast()` | Exibir notificação | `void` |
| `Utils.showLoading()` | Loading em botão | `void` |
| `Utils.formatPhone()` | Formatar telefone | `string` |
| `Utils.sanitizeHTML()` | Prevenir XSS | `string` |
| `Utils.debounce()` | Debounce função | `function` |

---

**Versão:** 3.0  
**Documentação completa:** `MELHORIAS_IMPLEMENTADAS.md`  
**Guia rápido:** `GUIA_RAPIDO.md`
