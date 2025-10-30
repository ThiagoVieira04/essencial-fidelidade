# 🧪 Guia de QA - Teste de Botões

## 📋 Instruções Gerais

**Objetivo:** Verificar que todos os botões executam suas ações esperadas  
**Tempo Estimado:** 15-20 minutos  
**Pré-requisitos:** Aplicação rodando localmente ou em produção

---

## 🏠 **TESTE 1: Página Cliente (index.html)**

### **1.1 Tela de Login**

#### **Botão: Entrar**
```
✅ Passos:
1. Acesse index.html
2. Digite nome: "admin"
3. Digite senha: "admin123"
4. Clique em "Entrar"

✅ Resultado Esperado:
- Redireciona para admin.html
- Toast verde: "Bem-vindo, Administrador!"

✅ Teste Alternativo (usuário comum):
1. Digite nome de usuário cadastrado
2. Digite senha correta
3. Clique em "Entrar"
- Mostra cartão de fidelidade
- Toast verde: "Bem-vindo, [Nome]!"

❌ Teste de Erro:
1. Digite credenciais inválidas
2. Clique em "Entrar"
- Toast vermelho: "Nome ou senha inválidos"
```

#### **Botão: Mostrar/Ocultar Senha**
```
✅ Passos:
1. Digite qualquer senha
2. Clique no ícone 👁️

✅ Resultado Esperado:
- Senha fica visível (type="text")
- Ícone muda para 🙈
- Clicar novamente oculta senha
```

#### **Link: Cadastre-se**
```
✅ Passos:
1. Clique em "Cadastre-se"

✅ Resultado Esperado:
- Tela de login desaparece
- Tela de cadastro aparece
- Sem reload da página
```

#### **Link: Área Administrativa**
```
✅ Passos:
1. Clique em "Área Administrativa"

✅ Resultado Esperado:
- Navega para admin.html
- Página recarrega
```

---

### **1.2 Tela de Cadastro**

#### **Botão: Cadastrar**
```
✅ Passos:
1. Clique em "Cadastre-se" na tela de login
2. Digite nome: "Teste QA"
3. Digite celular: "21987654321"
4. Digite senha: "senha123"
5. Clique em "Cadastrar"

✅ Resultado Esperado:
- Toast verde: "Cadastro realizado com sucesso!"
- Volta para tela de login
- Formulário limpo

❌ Teste de Erro (nome curto):
1. Digite nome: "A"
2. Preencha outros campos
3. Clique em "Cadastrar"
- Toast vermelho: "Nome deve ter pelo menos 2 caracteres"

❌ Teste de Erro (telefone inválido):
1. Digite telefone: "123"
2. Preencha outros campos
3. Clique em "Cadastrar"
- Toast vermelho: "Telefone inválido (use DDD + número)"

❌ Teste de Erro (senha curta):
1. Digite senha: "12345"
2. Preencha outros campos
3. Clique em "Cadastrar"
- Toast vermelho: "Senha deve ter pelo menos 6 caracteres"
```

#### **Botão: Mostrar/Ocultar Senha**
```
✅ Passos:
1. Digite qualquer senha
2. Clique no ícone 👁️

✅ Resultado Esperado:
- Senha fica visível
- Ícone muda para 🙈
```

#### **Link: Entrar**
```
✅ Passos:
1. Clique em "Entrar"

✅ Resultado Esperado:
- Volta para tela de login
- Sem reload da página
```

---

### **1.3 Tela do Cartão**

#### **Botão: Sair**
```
✅ Passos:
1. Faça login com usuário válido
2. Clique em "Sair"

✅ Resultado Esperado:
- Volta para tela de login
- Sessão encerrada
- Cartão não aparece mais
```

---

## 🔧 **TESTE 2: Painel Admin (admin.html)**

### **2.1 Tela de Login Admin**

#### **Botão: Entrar**
```
✅ Passos:
1. Acesse admin.html
2. Digite usuário: "admin"
3. Digite senha: "admin123"
4. Clique em "Entrar"

✅ Resultado Esperado:
- Mostra dashboard admin
- Toast verde: "Bem-vindo, Administrador!"
- Aba "Clientes" ativa

❌ Teste de Erro:
1. Digite credenciais erradas
2. Clique em "Entrar"
- Toast vermelho: "Credenciais inválidas!"
```

#### **Botão: Mostrar/Ocultar Senha**
```
✅ Passos:
1. Digite qualquer senha
2. Clique no ícone 👁️

✅ Resultado Esperado:
- Senha fica visível
- Ícone muda para 🙈
```

#### **Link: Voltar ao site**
```
✅ Passos:
1. Clique em "← Voltar ao site"

✅ Resultado Esperado:
- Navega para index.html
```

---

### **2.2 Dashboard Admin - Header**

#### **Botão: Sair**
```
✅ Passos:
1. Faça login como admin
2. Clique em "Sair" (canto superior direito)

✅ Resultado Esperado:
- Volta para tela de login admin
- Sessão encerrada
```

---

### **2.3 Dashboard Admin - Navegação**

#### **Botão: Clientes**
```
✅ Passos:
1. Faça login como admin
2. Clique em "Selos" ou "Configurações"
3. Clique em "Clientes"

✅ Resultado Esperado:
- Seção "Clientes" aparece
- Botão "Clientes" fica verde (active)
- Outras seções ficam ocultas
```

#### **Botão: Selos**
```
✅ Passos:
1. Clique em "Selos"

✅ Resultado Esperado:
- Seção "Selos" aparece
- Botão "Selos" fica verde (active)
- Select de clientes aparece
```

#### **Botão: Configurações**
```
✅ Passos:
1. Clique em "Configurações"

✅ Resultado Esperado:
- Seção "Configurações" aparece
- Botão "Configurações" fica verde (active)
- Formulário de alterar senha aparece
```

---

### **2.4 Seção Clientes**

#### **Botão: + Novo Cliente**
```
✅ Passos:
1. Na seção "Clientes", clique em "+ Novo Cliente"

✅ Resultado Esperado:
- Modal aparece
- Título: "Novo Cliente"
- Formulário vazio
- Foco no campo "Nome"
```

#### **Campo de Busca**
```
✅ Passos:
1. Digite "João" no campo de busca
2. Aguarde 300ms

✅ Resultado Esperado:
- Lista filtra clientes com "João" no nome
- Debounce funciona (não busca a cada tecla)
```

#### **Botão: Editar (dinâmico)**
```
✅ Passos:
1. Clique em "Editar" em qualquer cliente

✅ Resultado Esperado:
- Modal aparece
- Título: "Editar Cliente"
- Campos preenchidos com dados do cliente
```

#### **Botão: Excluir (dinâmico)**
```
✅ Passos:
1. Clique em "Excluir" em qualquer cliente
2. Confirme no alert

✅ Resultado Esperado:
- Confirmação: "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
- Cliente removido da lista
- Toast verde: "Cliente excluído com sucesso!"

❌ Teste de Cancelamento:
1. Clique em "Excluir"
2. Clique em "Cancelar" no alert
- Cliente permanece na lista
```

---

### **2.5 Modal Cliente**

#### **Botão: X (Fechar)**
```
✅ Passos:
1. Abra modal (Novo Cliente ou Editar)
2. Clique no X

✅ Resultado Esperado:
- Modal fecha
- Formulário resetado
```

#### **Botão: Cancelar**
```
✅ Passos:
1. Abra modal
2. Clique em "Cancelar"

✅ Resultado Esperado:
- Modal fecha
- Formulário resetado
```

#### **Botão: Salvar**
```
✅ Passos (Novo Cliente):
1. Clique em "+ Novo Cliente"
2. Preencha:
   - Nome: "Cliente Teste"
   - Email: "teste@email.com"
   - Telefone: "21987654321"
   - Senha: "senha123"
3. Clique em "Salvar"

✅ Resultado Esperado:
- Modal fecha
- Cliente aparece na lista
- Toast verde: "Cliente cadastrado com sucesso!"

✅ Passos (Editar Cliente):
1. Clique em "Editar" em um cliente
2. Altere o nome
3. Clique em "Salvar"

✅ Resultado Esperado:
- Modal fecha
- Nome atualizado na lista
- Toast verde: "Cliente atualizado com sucesso!"

❌ Teste de Erro (validação):
1. Tente salvar com nome de 1 letra
- Toast vermelho: "Nome deve ter pelo menos 2 caracteres"
```

#### **Botão: Mostrar/Ocultar Senha**
```
✅ Passos:
1. Abra modal
2. Digite senha
3. Clique no ícone 👁️

✅ Resultado Esperado:
- Senha fica visível
- Ícone muda para 🙈
```

---

### **2.6 Seção Selos**

#### **Select: Selecione um cliente**
```
✅ Passos:
1. Vá para seção "Selos"
2. Selecione um cliente no dropdown

✅ Resultado Esperado:
- Nome do cliente aparece
- Contagem de selos aparece (X/10)
- Grid de selos aparece
- Botões de ação aparecem
```

#### **Botão: + Adicionar Selo**
```
✅ Passos:
1. Selecione um cliente com menos de 10 selos
2. Clique em "+ Adicionar Selo"

✅ Resultado Esperado:
- Botão mostra "Carregando..."
- Selo adicionado ao grid
- Contagem atualiza
- Toast verde: "Selo adicionado com sucesso!"

❌ Teste de Erro (cartão completo):
1. Selecione cliente com 10 selos
2. Clique em "+ Adicionar Selo"
- Toast laranja: "Este cliente já possui o cartão completo!"
```

#### **Botão: - Remover Selo**
```
✅ Passos:
1. Selecione cliente com pelo menos 1 selo
2. Clique em "- Remover Selo"
3. Confirme no alert

✅ Resultado Esperado:
- Confirmação: "Tem certeza que deseja remover o último selo?"
- Último selo removido
- Contagem atualiza
- Toast verde: "Selo removido com sucesso!"

❌ Teste de Erro (sem selos):
1. Selecione cliente sem selos
2. Clique em "- Remover Selo"
- Toast laranja: "Este cliente não possui selos para remover!"
```

#### **Botão: Resetar Cartão**
```
✅ Passos:
1. Selecione cliente com selos
2. Clique em "Resetar Cartão"
3. Confirme no alert

✅ Resultado Esperado:
- Confirmação: "Tem certeza que deseja resetar todos os selos de [Nome]? Esta ação não pode ser desfeita."
- Todos os selos removidos
- Contagem: 0/10
- Toast verde: "Cartão resetado com sucesso!"
```

---

### **2.7 Seção Configurações**

#### **Botão: Alterar Senha**
```
✅ Passos:
1. Vá para "Configurações"
2. Preencha:
   - Senha Atual: "admin123"
   - Nova Senha: "novasenha123"
   - Confirmar: "novasenha123"
3. Clique em "Alterar Senha"

✅ Resultado Esperado:
- Formulário limpo
- Toast verde: "Senha alterada com sucesso!"
- Nova senha funciona no próximo login

❌ Teste de Erro (senha atual errada):
1. Digite senha atual incorreta
2. Clique em "Alterar Senha"
- Toast vermelho: "Senha atual incorreta!"

❌ Teste de Erro (senhas não coincidem):
1. Nova Senha: "senha1"
2. Confirmar: "senha2"
3. Clique em "Alterar Senha"
- Toast vermelho: "As senhas não coincidem!"

❌ Teste de Erro (senha curta):
1. Nova Senha: "12345"
2. Clique em "Alterar Senha"
- Toast vermelho: "A nova senha deve ter pelo menos 6 caracteres!"
```

#### **Botões: Mostrar/Ocultar Senhas (3x)**
```
✅ Passos:
1. Digite senhas nos 3 campos
2. Clique nos ícones 👁️ de cada campo

✅ Resultado Esperado:
- Cada senha fica visível independentemente
- Ícones mudam para 🙈
```

---

## 📱 **TESTE 3: Mobile/Touch**

### **3.1 Teste em Dispositivo Móvel**

```
✅ Passos:
1. Acesse pelo celular (ou DevTools mobile)
2. Teste todos os botões acima
3. Verifique touch events

✅ Resultado Esperado:
- Todos os botões respondem ao toque
- Sem delay perceptível
- Feedback visual (active state)
- Password toggles funcionam com touchstart
```

### **3.2 Teste de Tap Highlight**

```
✅ Passos:
1. Toque rapidamente em vários botões

✅ Resultado Esperado:
- Sem highlight azul padrão do navegador
- Apenas feedback visual do botão (scale 0.98)
```

---

## ⌨️ **TESTE 4: Acessibilidade (Teclado)**

### **4.1 Navegação por Tab**

```
✅ Passos:
1. Pressione Tab repetidamente
2. Verifique se foco passa por todos os botões

✅ Resultado Esperado:
- Foco visível (outline)
- Ordem lógica (top → bottom, left → right)
- Botões ocultos não recebem foco
```

### **4.2 Ativação por Enter/Space**

```
✅ Passos:
1. Use Tab para focar um botão
2. Pressione Enter ou Space

✅ Resultado Esperado:
- Botão executa ação
- Mesmo comportamento do clique
```

---

## 🎨 **TESTE 5: Dark Mode**

### **5.1 Botões em Dark Mode**

```
✅ Passos:
1. Ative dark mode (se disponível)
2. Teste todos os botões

✅ Resultado Esperado:
- Botões visíveis e legíveis
- Cores ajustadas ao tema
- Funcionalidade mantida
```

---

## 🐛 **TESTE 6: Edge Cases**

### **6.1 Cliques Rápidos (Double Click)**

```
✅ Passos:
1. Clique rapidamente 2x em "Cadastrar"

✅ Resultado Esperado:
- Apenas 1 cadastro criado
- Loading state previne segundo clique
```

### **6.2 Formulário Vazio**

```
✅ Passos:
1. Tente submeter formulário vazio

✅ Resultado Esperado:
- HTML5 validation: "Preencha este campo"
- Ou toast: "Por favor, preencha todos os campos"
```

### **6.3 Conexão Lenta**

```
✅ Passos:
1. Simule conexão lenta (DevTools → Network → Slow 3G)
2. Clique em botões que fazem API calls

✅ Resultado Esperado:
- Loading state aparece
- Botão desabilitado durante operação
- Toast aparece após conclusão
```

---

## ✅ **CHECKLIST FINAL**

### **Cliente (index.html)**
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Toggle senha funciona
- [ ] Links de navegação funcionam
- [ ] Logout funciona
- [ ] Validações funcionam
- [ ] Toasts aparecem

### **Admin (admin.html)**
- [ ] Login admin funciona
- [ ] Navegação entre seções funciona
- [ ] CRUD de clientes funciona
- [ ] Gerenciamento de selos funciona
- [ ] Alterar senha funciona
- [ ] Modal abre/fecha corretamente
- [ ] Busca com debounce funciona
- [ ] Validações funcionam
- [ ] Toasts aparecem

### **Geral**
- [ ] Todos os botões respondem ao clique
- [ ] Touch events funcionam em mobile
- [ ] Navegação por teclado funciona
- [ ] Loading states aparecem
- [ ] Sem erros no console
- [ ] Sem regressão visual

---

## 📊 **RELATÓRIO DE TESTE**

**Data:** ___/___/2025  
**Testador:** _________________  
**Ambiente:** [ ] Local [ ] Produção  
**Dispositivo:** [ ] Desktop [ ] Mobile [ ] Ambos  

**Resultado:**
- [ ] ✅ Todos os testes passaram
- [ ] ⚠️ Alguns testes falharam (detalhar abaixo)
- [ ] ❌ Muitos testes falharam (não aprovar)

**Observações:**
_________________
_________________
_________________

**Aprovado para Produção:** [ ] Sim [ ] Não

---

**Tempo Total de Teste:** ~20 minutos  
**Cobertura:** 100% dos botões  
**Status:** ✅ Pronto para QA
