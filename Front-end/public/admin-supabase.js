class AdminManagerSupabase {
  constructor() {
    this.ADMIN_CREDENTIALS = { 
      username: 'admin', 
      password: localStorage.getItem('adminPassword') || 'admin123' 
    };
    this.currentUser = null;
    this.clients = [];
    this.selectedClient = null;
    
    this.initElements();
    this.bindEvents();
    this.init();
  }

  initElements() {
    this.loginView = document.getElementById('admin-login-view');
    this.dashboard = document.getElementById('admin-dashboard');
    this.loginForm = document.getElementById('admin-login-form');
    this.clientForm = document.getElementById('client-form');
    this.navButtons = document.querySelectorAll('.nav-btn');
    this.sections = document.querySelectorAll('.admin-section');
    this.clientsList = document.getElementById('clients-list');
    this.clientSearch = document.getElementById('client-search');
    this.addClientBtn = document.getElementById('add-client-btn');
    this.clientModal = document.getElementById('client-modal');
    this.closeModal = document.querySelector('.close');
    this.clientSelect = document.getElementById('client-select');
    this.stampsManagement = document.getElementById('stamps-management');
    this.selectedClientName = document.getElementById('selected-client-name');
    this.stampsCount = document.getElementById('stamps-count');
    this.stampsGrid = document.getElementById('stamps-grid');
    this.logoutBtn = document.getElementById('logout-admin');
    this.addStampBtn = document.getElementById('add-stamp');
    this.removeStampBtn = document.getElementById('remove-stamp');
    this.resetStampsBtn = document.getElementById('reset-stamps');
    this.cancelClientBtn = document.getElementById('cancel-client');
    this.togglePasswordBtn = document.getElementById('toggle-password');
    this.toggleLoginPasswordBtn = document.getElementById('toggle-login-password');
    this.changePasswordForm = document.getElementById('change-password-form');
    this.toggleCurrentPasswordBtn = document.getElementById('toggle-current-password');
    this.toggleNewPasswordBtn = document.getElementById('toggle-new-password');
    this.toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
  }

  bindEvents() {
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.logoutBtn.addEventListener('click', () => this.logout());
    
    // Adicionar listener para link "Voltar ao site"
    const backToSiteLink = document.querySelector('a[href="index.html"]');
    if (backToSiteLink) {
      backToSiteLink.addEventListener('click', (e) => this.handleBackToSite(e));
    }
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });
    this.addClientBtn.addEventListener('click', () => this.openClientModal());
    this.clientForm.addEventListener('submit', (e) => this.handleClientSubmit(e));
    this.closeModal.addEventListener('click', () => this.closeClientModal());
    this.cancelClientBtn.addEventListener('click', () => this.closeClientModal());
    this.clientSearch.addEventListener('input', Utils.debounce(() => this.filterClients(), 300));
    this.clientsList.addEventListener('click', (e) => this.handleClientAction(e));
    this.clientSelect.addEventListener('change', (e) => this.selectClientForStamps(e.target.value));
    
    // Event listeners para botões de selos com verificação
    if (this.addStampBtn) {
      this.addStampBtn.addEventListener('click', () => this.addStamp());
    }
    if (this.removeStampBtn) {
      this.removeStampBtn.addEventListener('click', () => this.removeStamp());
    }
    if (this.resetStampsBtn) {
      this.resetStampsBtn.addEventListener('click', () => this.resetStamps());
    }
    
    if (this.togglePasswordBtn) {
      this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
      this.togglePasswordBtn.addEventListener('touchstart', () => this.togglePasswordVisibility(), { passive: true });
    }
    if (this.toggleLoginPasswordBtn) {
      this.toggleLoginPasswordBtn.addEventListener('click', () => this.toggleLoginPasswordVisibility());
      this.toggleLoginPasswordBtn.addEventListener('touchstart', () => this.toggleLoginPasswordVisibility(), { passive: true });
    }
    
    if (this.changePasswordForm) {
      this.changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
    }
    
    if (this.toggleCurrentPasswordBtn) {
      this.toggleCurrentPasswordBtn.addEventListener('click', () => this.togglePasswordField('current-password', 'toggle-current-password'));
      this.toggleCurrentPasswordBtn.addEventListener('touchstart', () => this.togglePasswordField('current-password', 'toggle-current-password'), { passive: true });
    }
    if (this.toggleNewPasswordBtn) {
      this.toggleNewPasswordBtn.addEventListener('click', () => this.togglePasswordField('new-password', 'toggle-new-password'));
      this.toggleNewPasswordBtn.addEventListener('touchstart', () => this.togglePasswordField('new-password', 'toggle-new-password'), { passive: true });
    }
    if (this.toggleConfirmPasswordBtn) {
      this.toggleConfirmPasswordBtn.addEventListener('click', () => this.togglePasswordField('confirm-password', 'toggle-confirm-password'));
      this.toggleConfirmPasswordBtn.addEventListener('touchstart', () => this.togglePasswordField('confirm-password', 'toggle-confirm-password'), { passive: true });
    }
    
    window.addEventListener('click', (e) => {
      if (e.target === this.clientModal) this.closeClientModal();
    });
  }

  async init() {
    const adminUser = sessionStorage.getItem('adminUser');
    if (adminUser) {
      this.currentUser = JSON.parse(adminUser);
      await this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const submitBtn = this.loginForm.querySelector('button[type="submit"]');
    
    // Validações básicas
    if (!username || !password) {
      Utils.showToast('Preencha todos os campos', 'error');
      return;
    }
    
    if (username.length < 2) {
      Utils.showToast('Usuário inválido', 'error');
      return;
    }
    
    if (password.length < 6) {
      Utils.showToast('Senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }
    
    // Loading state
    Utils.showLoading(submitBtn, true);
    
    try {
      // Autentica via banco de dados (com fallback)
      const admin = await Database.authenticateAdmin(username, password);
      
      if (admin) {
        this.currentUser = { username: admin.username, id: admin.id };
        sessionStorage.setItem('adminUser', JSON.stringify(this.currentUser));
        
        // Atualiza credenciais em memória
        this.ADMIN_CREDENTIALS.username = admin.username;
        this.ADMIN_CREDENTIALS.password = password;
        
        await this.showDashboard();
        Utils.showToast('Bem-vindo, Administrador!', 'success');
      } else {
        Utils.showToast('Usuário ou senha incorretos', 'error');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Utils.showToast('Erro ao fazer login. Tente novamente.', 'error');
    } finally {
      Utils.showLoading(submitBtn, false);
    }
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('adminUser');
    this.showLogin();
  }

  handleBackToSite(e) {
    // Limpar sessão admin antes de navegar
    this.currentUser = null;
    sessionStorage.removeItem('adminUser');
    // Permitir navegação padrão do link
    // Não precisa e.preventDefault() pois queremos que o link funcione
  }

  showLogin() {
    this.loginView.style.display = 'flex';
    this.dashboard.style.display = 'none';
  }

  async showDashboard() {
    this.loginView.style.display = 'none';
    this.dashboard.style.display = 'block';
    await this.loadClients();
    this.renderClients();
    this.populateClientSelect();
  }

  switchSection(section) {
    this.navButtons.forEach(btn => btn.classList.remove('active'));
    this.sections.forEach(sec => sec.style.display = 'none');
    
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    document.getElementById(`${section}-section`).style.display = 'block';
    
    if (section === 'stamps') {
      this.populateClientSelect();
    }
  }

  async loadClients() {
    try {
      this.clients = await Database.getUsers();
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Utils.showToast('Erro ao carregar clientes', 'error');
      this.clients = [];
    }
  }

  renderClients() {
    this.clientsList.innerHTML = '';
    const filteredClients = this.getFilteredClients();
    
    filteredClients.forEach(async (client) => {
      const stamps = await Database.getUserStamps(client.id);
      const clientCard = this.createClientCard(client, stamps.length);
      this.clientsList.appendChild(clientCard);
    });
  }

  createClientCard(client, stampsCount) {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Cliente ${client.name}`);
    
    const safeName = Utils.sanitizeHTML(client.name);
    const safeEmail = Utils.sanitizeHTML(client.email || 'Não informado');
    const formattedPhone = Utils.formatPhone(client.phone);
    
    card.innerHTML = `
      <h4>${safeName}</h4>
      <p><strong>E-mail:</strong> ${safeEmail}</p>
      <p><strong>Telefone:</strong> ${formattedPhone}</p>
      <p><strong>Selos:</strong> ${stampsCount}/10</p>
      <div class="client-actions">
        <button class="edit-btn" data-action="edit" data-id="${client.id}" aria-label="Editar ${safeName}">Editar</button>
        <button class="delete-btn" data-action="delete" data-id="${client.id}" aria-label="Excluir ${safeName}">Excluir</button>
      </div>
    `;
    return card;
  }

  getFilteredClients() {
    const searchTerm = this.clientSearch.value.toLowerCase();
    return this.clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm)) ||
      client.phone.includes(searchTerm)
    );
  }

  filterClients() {
    // Debounce aplicado no bindEvents
    this.renderClients();
  }

  async handleClientAction(e) {
    const action = e.target.dataset.action;
    const clientId = parseInt(e.target.dataset.id);
    
    if (action === 'edit') {
      this.editClient(clientId);
    } else if (action === 'delete') {
      await this.deleteClient(clientId);
    }
  }

  openClientModal(client = null) {
    const modalTitle = document.getElementById('modal-title');
    
    if (client) {
      modalTitle.textContent = 'Editar Cliente';
      document.getElementById('client-id').value = client.id;
      document.getElementById('client-name').value = client.name;
      document.getElementById('client-email').value = client.email || '';
      document.getElementById('client-phone').value = client.phone;
      document.getElementById('client-password').value = client.password;
    } else {
      modalTitle.textContent = 'Novo Cliente';
      this.clientForm.reset();
      document.getElementById('client-id').value = '';
    }
    
    this.clientModal.style.display = 'block';
  }

  closeClientModal() {
    this.clientModal.style.display = 'none';
    this.clientForm.reset();
    // Reset password visibility
    const passwordInput = document.getElementById('client-password');
    if (passwordInput && this.togglePasswordBtn) {
      const eyeIcon = this.togglePasswordBtn.querySelector('.eye-icon');
      passwordInput.type = 'password';
      eyeIcon.textContent = '👁️';
      this.togglePasswordBtn.setAttribute('aria-label', 'Mostrar senha');
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('client-password');
    const eyeIcon = this.togglePasswordBtn.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.textContent = '🙈';
      this.togglePasswordBtn.setAttribute('aria-label', 'Ocultar senha');
    } else {
      passwordInput.type = 'password';
      eyeIcon.textContent = '👁️';
      this.togglePasswordBtn.setAttribute('aria-label', 'Mostrar senha');
    }
  }

  // Funcionalidade de mostrar/ocultar limitada apenas ao campo de senha do login admin
  // Removido do campo usuário por questões de segurança e UX
  toggleLoginPasswordVisibility() {
    const passwordInput = document.getElementById('admin-password');
    const eyeIcon = document.querySelector('#toggle-login-password .eye-icon');
    const toggleBtn = document.getElementById('toggle-login-password');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.textContent = '🙈';
      toggleBtn.setAttribute('aria-label', 'Ocultar senha');
    } else {
      passwordInput.type = 'password';
      eyeIcon.textContent = '👁️';
      toggleBtn.setAttribute('aria-label', 'Mostrar senha');
    }
  }

  async handleClientSubmit(e) {
    e.preventDefault();
    
    const clientData = {
      name: document.getElementById('client-name').value.trim(),
      email: document.getElementById('client-email').value.trim(),
      phone: document.getElementById('client-phone').value.trim(),
      password: document.getElementById('client-password').value.trim()
    };
    
    const clientId = document.getElementById('client-id').value;
    
    try {
      if (clientId) {
        await this.updateClient(parseInt(clientId), clientData);
      } else {
        await this.createClient(clientData);
      }
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  }

  async createClient(clientData) {
    // Validações
    const nameValidation = Utils.validateName(clientData.name);
    if (!nameValidation.valid) {
      Utils.showToast(nameValidation.error, 'error');
      return;
    }
    
    const phoneValidation = Utils.validatePhone(clientData.phone);
    if (!phoneValidation.valid) {
      Utils.showToast(phoneValidation.error, 'error');
      return;
    }
    
    const passwordValidation = Utils.validatePassword(clientData.password);
    if (!passwordValidation.valid) {
      Utils.showToast(passwordValidation.error, 'error');
      return;
    }
    
    if (clientData.email) {
      const emailValidation = Utils.validateEmail(clientData.email);
      if (!emailValidation.valid) {
        Utils.showToast(emailValidation.error, 'error');
        return;
      }
    }
    
    const existingClient = this.clients.find(c => 
      c.name.toLowerCase() === nameValidation.value.toLowerCase() ||
      (clientData.email && c.email === clientData.email.toLowerCase())
    );
    
    if (existingClient) {
      Utils.showToast('Cliente com este nome ou e-mail já existe!', 'error');
      return;
    }
    
    try {
      await Database.createUser(clientData);
      await this.loadClients();
      this.renderClients();
      this.populateClientSelect();
      this.closeClientModal();
      Utils.showToast('Cliente cadastrado com sucesso!', 'success');
    } catch (error) {
      Utils.showToast(error.message || 'Erro ao cadastrar cliente', 'error');
    }
  }

  async updateClient(clientId, clientData) {
    try {
      await Database.updateUser(clientId, clientData);
      await this.loadClients();
      this.renderClients();
      this.populateClientSelect();
      this.closeClientModal();
      Utils.showToast('Cliente atualizado com sucesso!', 'success');
    } catch (error) {
      Utils.showToast(error.message || 'Erro ao atualizar cliente', 'error');
    }
  }

  editClient(clientId) {
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      this.openClientModal(client);
    }
  }

  async deleteClient(clientId) {
    if (confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      try {
        await Database.deleteUser(clientId);
        await this.loadClients();
        this.renderClients();
        this.populateClientSelect();
        Utils.showToast('Cliente excluído com sucesso!', 'success');
      } catch (error) {
        Utils.showToast(error.message || 'Erro ao excluir cliente', 'error');
      }
    }
  }

  async populateClientSelect() {
    this.clientSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um cliente';
    this.clientSelect.appendChild(defaultOption);
    
    for (const client of this.clients) {
      const stamps = await Database.getUserStamps(client.id);
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.name} (${stamps.length}/10 selos)`;
      this.clientSelect.appendChild(option);
    }
  }

  async selectClientForStamps(clientId) {
    if (!clientId || clientId === '') {
      this.stampsManagement.style.display = 'none';
      this.selectedClient = null;
      return;
    }
    
    this.selectedClient = this.clients.find(c => c.id === parseInt(clientId));
    if (this.selectedClient) {
      this.selectedClientName.textContent = this.selectedClient.name;
      await this.updateStampsDisplay();
      this.stampsManagement.style.display = 'block';
    }
  }

  async updateStampsDisplay() {
    if (!this.selectedClient) return;
    
    const stamps = await Database.getUserStamps(this.selectedClient.id);
    this.stampsCount.textContent = stamps.length;
    
    this.stampsGrid.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const slot = document.createElement('div');
      slot.className = 'stamp-slot';
      
      if (i < stamps.length) {
        slot.classList.add('filled');
        const stamp = stamps[i];
        const date = new Date(stamp.created_at);
        slot.innerHTML = `${date.toLocaleDateString('pt-BR')}<br>${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
      } else {
        slot.textContent = i + 1;
      }
      
      this.stampsGrid.appendChild(slot);
    }
  }

  async addStamp() {
    if (!this.selectedClient) {
      Utils.showToast('Selecione um cliente primeiro!', 'warning');
      return;
    }
    
    if (this.addStampBtn) Utils.showLoading(this.addStampBtn, true);
    
    try {
      const stamps = await Database.getUserStamps(this.selectedClient.id);
      if (stamps.length >= 10) {
        Utils.showToast('Este cliente já possui o cartão completo!', 'warning');
        return;
      }
      
      await Database.addStamp(this.selectedClient.id, {
        created_at: new Date().toISOString()
      });
      
      await this.updateStampsDisplay();
      await this.populateClientSelect();
      Utils.showToast('Selo adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar selo:', error);
      Utils.showToast(error.message || 'Erro ao adicionar selo', 'error');
    } finally {
      if (this.addStampBtn) Utils.showLoading(this.addStampBtn, false);
    }
  }

  async removeStamp() {
    if (!this.selectedClient) return;
    
    try {
      const stamps = await Database.getUserStamps(this.selectedClient.id);
      if (!stamps.length) {
        Utils.showToast('Este cliente não possui selos para remover!', 'warning');
        return;
      }
      
      if (confirm('Tem certeza que deseja remover o último selo?')) {
        if (this.removeStampBtn) Utils.showLoading(this.removeStampBtn, true);
        
        const lastStamp = stamps[stamps.length - 1];
        await Database.deleteStamp(lastStamp.id);
        await this.updateStampsDisplay();
        this.populateClientSelect();
        Utils.showToast('Selo removido com sucesso!', 'success');
      }
    } catch (error) {
      Utils.showToast(error.message || 'Erro ao remover selo', 'error');
    } finally {
      if (this.removeStampBtn) Utils.showLoading(this.removeStampBtn, false);
    }
  }

  async resetStamps() {
    if (!this.selectedClient) return;
    
    if (confirm(`Tem certeza que deseja resetar todos os selos de ${this.selectedClient.name}? Esta ação não pode ser desfeita.`)) {
      if (this.resetStampsBtn) Utils.showLoading(this.resetStampsBtn, true);
      
      try {
        await Database.resetUserStamps(this.selectedClient.id);
        await this.updateStampsDisplay();
        this.populateClientSelect();
        Utils.showToast('Cartão resetado com sucesso!', 'success');
      } catch (error) {
        Utils.showToast(error.message || 'Erro ao resetar cartão', 'error');
      } finally {
        if (this.resetStampsBtn) Utils.showLoading(this.resetStampsBtn, false);
      }
    }
  }

  togglePasswordField(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.querySelector(`#${buttonId} .eye-icon`);
    const toggleBtn = document.getElementById(buttonId);
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.textContent = '🙈';
      toggleBtn.setAttribute('aria-label', 'Ocultar senha');
    } else {
      passwordInput.type = 'password';
      eyeIcon.textContent = '👁️';
      toggleBtn.setAttribute('aria-label', 'Mostrar senha');
    }
  }

  async handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const submitBtn = this.changePasswordForm.querySelector('button[type="submit"]');
    
    // Valida senha atual
    if (currentPassword !== this.ADMIN_CREDENTIALS.password) {
      Utils.showToast('Senha atual incorreta!', 'error');
      return;
    }
    
    // Valida nova senha
    const passwordValidation = Utils.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      Utils.showToast(passwordValidation.error, 'error');
      return;
    }
    
    // Valida confirmação
    if (newPassword !== confirmPassword) {
      Utils.showToast('As senhas não coincidem!', 'error');
      return;
    }
    
    // Loading state
    Utils.showLoading(submitBtn, true);
    
    try {
      // Atualiza no banco (com fallback para localStorage)
      const username = this.currentUser?.username || 'admin';
      await Database.updateAdminPassword(username, newPassword);
      
      // Atualiza em memória
      this.ADMIN_CREDENTIALS.password = newPassword;
      
      this.changePasswordForm.reset();
      Utils.showToast('Senha alterada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      Utils.showToast('Erro ao alterar senha. Tente novamente.', 'error');
    } finally {
      Utils.showLoading(submitBtn, false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminManagerSupabase();
});