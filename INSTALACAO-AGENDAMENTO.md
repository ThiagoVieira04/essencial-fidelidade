# 📅 INSTALAÇÃO DO SISTEMA DE AGENDAMENTO

## 🎯 **Visão Geral**

Sistema de agendamento completo e independente integrado ao projeto Essencial Fidelidade.

### ✅ **Características**
- ✅ 100% Gratuito (usa Supabase free tier)
- ✅ Não altera funcionalidades existentes
- ✅ Mantém o design original
- ✅ Módulo independente
- ✅ Notificações locais gratuitas

---

## 🚀 **PASSO A PASSO DE INSTALAÇÃO**

### **1. Configurar Banco de Dados**

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Abra o arquivo `supabase-agendamento.sql`
4. Copie todo o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **RUN** para executar

✅ **Resultado**: Tabelas `appointments` e `blocked_slots` criadas

---

### **2. Verificar Arquivos Criados**

Certifique-se de que os seguintes arquivos foram criados em `Front-end/public/`:

```
Front-end/public/
├── agendamentos.html              ← Página do cliente
├── agendamento.js                 ← Lógica do cliente
├── admin-agendamentos.html        ← Página do admin
├── admin-agendamento.js           ← Lógica do admin
└── notification-service.js        ← Sistema de notificações (opcional)
```

---

### **3. Integração Automática**

Os arquivos `index.html` e `admin.html` já foram atualizados com:

**Cliente (index.html)**:
- Botão "📅 Agendamentos" no cabeçalho do cartão

**Admin (admin.html)**:
- Botão "📅 Agendamentos" no menu de navegação

---

### **4. Testar o Sistema**

#### **Como Cliente:**
1. Faça login no sistema (ou cadastre-se)
2. Clique no botão **"📅 Agendamentos"**
3. Clique em **"+ Novo Agendamento"**
4. Selecione:
   - Serviço (ex: Limpeza de Pele)
   - Data
   - Horário disponível
5. Clique em **"Agendar"**

#### **Como Admin:**
1. Acesse `admin.html`
2. Faça login (admin/admin123)
3. Clique no botão **"📅 Agendamentos"**
4. Visualize todos os agendamentos
5. Confirme/Cancele agendamentos
6. Bloqueie horários na aba "Horários Bloqueados"

---

## 🗄️ **ESTRUTURA DO BANCO DE DADOS**

### **Tabela: appointments**
```sql
- id (UUID)
- user_id (INTEGER) → Referência ao cliente
- service_name (VARCHAR) → Nome do serviço
- appointment_date (DATE) → Data do agendamento
- appointment_time (TIME) → Horário
- status (VARCHAR) → pending/confirmed/cancelled/completed
- notes (TEXT) → Observações opcionais
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Tabela: blocked_slots**
```sql
- id (UUID)
- block_date (DATE) → Data bloqueada
- block_time (TIME) → Horário bloqueado
- reason (VARCHAR) → Motivo do bloqueio
- created_by (VARCHAR) → Quem bloqueou
- created_at (TIMESTAMP)
```

---

## 🔔 **SISTEMA DE NOTIFICAÇÕES (OPCIONAL)**

### **Ativar Notificações Locais**

1. Adicione no final de `agendamentos.html` (antes do `</body>`):
```html
<script src="notification-service.js"></script>
<script>
  // Inicializar notificações ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    initNotificationService();
  });
</script>
```

2. O sistema irá:
   - Solicitar permissão para notificações
   - Verificar agendamentos do dia seguinte
   - Enviar lembretes automáticos

### **Como Funciona:**
- ✅ 100% gratuito (Web Notifications API)
- ✅ Funciona offline (PWA)
- ✅ Não precisa de servidor externo
- ✅ Notificações aparecem no sistema operacional

---

## 📱 **FUNCIONALIDADES**

### **Para Clientes:**
- ✅ Ver apenas seus próprios agendamentos
- ✅ Criar novos agendamentos
- ✅ Cancelar agendamentos pendentes
- ✅ Ver status (Pendente/Confirmado/Cancelado/Concluído)
- ✅ Adicionar observações
- ✅ Receber notificações de lembrete

### **Para Administradores:**
- ✅ Ver todos os agendamentos
- ✅ Confirmar agendamentos pendentes
- ✅ Cancelar agendamentos
- ✅ Marcar como concluído
- ✅ Bloquear horários (feriados, manutenção)
- ✅ Desbloquear horários
- ✅ Filtrar por data e status
- ✅ Ver informações do cliente (nome, telefone)

---

## 🎨 **SERVIÇOS DISPONÍVEIS**

Os serviços padrão são:
- Limpeza de Pele
- Massagem Relaxante
- Drenagem Linfática
- Depilação
- Peeling
- Consulta

**Para adicionar mais serviços:**
Edite o `<select id="serviceName">` em `agendamentos.html`:
```html
<option value="Novo Serviço">Novo Serviço</option>
```

---

## ⏰ **HORÁRIOS DISPONÍVEIS**

Horários padrão: **8h às 18h** (intervalos de 1 hora)

**Para alterar:**
Edite o array `availableTimes` em `agendamento.js`:
```javascript
const availableTimes = [
    '08:00', '09:00', '10:00', // ... adicione mais
];
```

---

## 🔒 **SEGURANÇA**

- ✅ Row Level Security (RLS) habilitado
- ✅ Clientes veem apenas seus agendamentos
- ✅ Admin vê todos os agendamentos
- ✅ Validação de horários duplicados
- ✅ Proteção contra SQL injection (Supabase)

---

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Erro: "Tabela não encontrada"**
- Execute o SQL `supabase-agendamento.sql` no Supabase

### **Erro: "Permissão negada"**
- Verifique se RLS está configurado corretamente
- Execute novamente as políticas no SQL

### **Horários não aparecem**
- Verifique se a data selecionada é válida
- Limpe o cache do navegador

### **Notificações não funcionam**
- Verifique se o navegador suporta notificações
- Permita notificações nas configurações do navegador

---

## 📊 **ESTATÍSTICAS DO SUPABASE (FREE TIER)**

- ✅ 500 MB de banco de dados
- ✅ 1 GB de transferência/mês
- ✅ 50.000 usuários ativos/mês
- ✅ API REST ilimitada
- ✅ Realtime ilimitado

**Suficiente para:**
- ~10.000 agendamentos
- ~1.000 clientes ativos
- Uso de clínica pequena/média

---

## 🔄 **ATUALIZAÇÕES FUTURAS (OPCIONAL)**

### **Possíveis Melhorias:**
- [ ] Integração com WhatsApp (via API gratuita)
- [ ] Exportar relatórios em PDF
- [ ] Dashboard com gráficos
- [ ] Agendamento recorrente
- [ ] Lista de espera
- [ ] Avaliação pós-atendimento

---

## 📞 **SUPORTE**

**Desenvolvedor:** Thiago Vieira  
**WhatsApp:** (21) 98717-2463  
**GitHub:** [ThiagoVieira04](https://github.com/ThiagoVieira04)

---

## ✅ **CHECKLIST DE INSTALAÇÃO**

- [ ] SQL executado no Supabase
- [ ] Arquivos criados em `Front-end/public/`
- [ ] Botões adicionados em `index.html` e `admin.html`
- [ ] Testado como cliente
- [ ] Testado como admin
- [ ] Notificações configuradas (opcional)
- [ ] Sistema funcionando sem erros

---

## 🎉 **PRONTO!**

O sistema de agendamento está instalado e funcionando!

**Próximos passos:**
1. Teste todas as funcionalidades
2. Personalize os serviços conforme necessário
3. Configure os horários de atendimento
4. Treine a equipe para usar o painel admin

---

**⭐ Sistema 100% gratuito, independente e sem alterar funcionalidades existentes!**
