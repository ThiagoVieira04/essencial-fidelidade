class AdminManagerSupabase {
  constructor() {
    this.ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };
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
  }

  bindEvents() {
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.logoutBtn.addEventListener('click', () => this.logout());
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });
    this.addClientBtn.addEventListener('click', () => this.openClientModal());
    this.clientForm.addEventListener('submit', (e) => this.handleClientSubmit(e));
    this.closeModal.addEventListener('click', () => this.closeClientModal());
    this.cancelClientBtn.addEventListener('click', () => this.closeClientModal());
    this.clientSearch.addEventListener('input', (e) => this.filterClients(e.target.value));
    this.clientsList.addEventListener('click', (e) => this.handleClientAction(e));
    this.clientSelect.addEventListener('change', (e) => this.selectClientForStamps(e.target.value));
    this.addStampBtn.addEventListener('click', () => this.addStamp());
    this.removeStampBtn.addEventListener('click', () => this.removeStamp());
    this.resetStampsBtn.addEventListener('click', () => this.resetStamps());
    
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

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    
    if (username === this.ADMIN_CREDENTIALS.username && password === this.ADMIN_CREDENTIALS.password) {
      this.currentUser = { username };
      sessionStorage.setItem('adminUser', JSON.stringify(this.currentUser));
      this.showDashboard();
    } else {
      alert('Credenciais inválidas!');
    }
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('adminUser');
    this.showLogin();
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
    card.innerHTML = `
      <h4>${client.name}</h4>
      <p><strong>E-mail:</strong> ${client.email || 'Não informado'}</p>
      <p><strong>Telefone:</strong> ${client.phone}</p>
      <p><strong>Selos:</strong> ${stampsCount}/10</p>
      <div class="client-actions">
        <button class="edit-btn" data-action="edit" data-id="${client.id}">Editar</button>
        <button class="delete-btn" data-action="delete" data-id="${client.id}">Excluir</button>
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
    const existingClient = this.clients.find(c => 
      c.name.toLowerCase() === clientData.name.toLowerCase() ||
      (clientData.email && c.email === clientData.email)
    );
    
    if (existingClient) {
      alert('Cliente com este nome ou e-mail já existe!');
      return;
    }
    
    await Database.createUser(clientData);
    await this.loadClients();
    this.renderClients();
    this.populateClientSelect();
    this.closeClientModal();
    alert('Cliente cadastrado com sucesso!');
  }

  async updateClient(clientId, clientData) {
    await Database.updateUser(clientId, clientData);
    await this.loadClients();
    this.renderClients();
    this.populateClientSelect();
    this.closeClientModal();
    alert('Cliente atualizado com sucesso!');
  }

  editClient(clientId) {
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      this.openClientModal(client);
    }
  }

  async deleteClient(clientId) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await Database.deleteUser(clientId);
      await this.loadClients();
      this.renderClients();
      this.populateClientSelect();
      alert('Cliente excluído com sucesso!');
    }
  }

  async populateClientSelect() {
    this.clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    for (const client of this.clients) {
      const stamps = await Database.getUserStamps(client.id);
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.name} (${stamps.length}/10 selos)`;
      this.clientSelect.appendChild(option);
    }
  }

  async selectClientForStamps(clientId) {
    if (!clientId) {
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
    if (!this.selectedClient) return;
    
    const stamps = await Database.getUserStamps(this.selectedClient.id);
    if (stamps.length >= 10) {
      alert('Este cliente já possui o cartão completo!');
      return;
    }
    
    await Database.addStamp(this.selectedClient.id, {
      created_at: new Date().toISOString()
    });
    
    await this.updateStampsDisplay();
    this.populateClientSelect();
    alert('Selo adicionado com sucesso!');
  }

  async removeStamp() {
    if (!this.selectedClient) return;
    
    const stamps = await Database.getUserStamps(this.selectedClient.id);
    if (!stamps.length) {
      alert('Este cliente não possui selos para remover!');
      return;
    }
    
    if (confirm('Tem certeza que deseja remover o último selo?')) {
      const lastStamp = stamps[stamps.length - 1];
      await Database.deleteStamp(lastStamp.id);
      await this.updateStampsDisplay();
      this.populateClientSelect();
      alert('Selo removido com sucesso!');
    }
  }

  async resetStamps() {
    if (!this.selectedClient) return;
    
    if (confirm(`Tem certeza que deseja resetar todos os selos de ${this.selectedClient.name}?`)) {
      await Database.resetUserStamps(this.selectedClient.id);
      await this.updateStampsDisplay();
      this.populateClientSelect();
      alert('Cartão resetado com sucesso!');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminManagerSupabase();
});