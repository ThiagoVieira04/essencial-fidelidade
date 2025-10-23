class AdminManager {
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
    // Views
    this.loginView = document.getElementById('admin-login-view');
    this.dashboard = document.getElementById('admin-dashboard');
    
    // Forms
    this.loginForm = document.getElementById('admin-login-form');
    this.clientForm = document.getElementById('client-form');
    
    // Navigation
    this.navButtons = document.querySelectorAll('.nav-btn');
    this.sections = document.querySelectorAll('.admin-section');
    
    // Client management
    this.clientsList = document.getElementById('clients-list');
    this.clientSearch = document.getElementById('client-search');
    this.addClientBtn = document.getElementById('add-client-btn');
    this.clientModal = document.getElementById('client-modal');
    this.closeModal = document.querySelector('.close');
    
    // Stamps management
    this.clientSelect = document.getElementById('client-select');
    this.stampsManagement = document.getElementById('stamps-management');
    this.selectedClientName = document.getElementById('selected-client-name');
    this.stampsCount = document.getElementById('stamps-count');
    this.stampsGrid = document.getElementById('stamps-grid');
    
    // Buttons
    this.logoutBtn = document.getElementById('logout-admin');
    this.addStampBtn = document.getElementById('add-stamp');
    this.removeStampBtn = document.getElementById('remove-stamp');
    this.resetStampsBtn = document.getElementById('reset-stamps');
    this.cancelClientBtn = document.getElementById('cancel-client');
  }

  bindEvents() {
    // Login
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.logoutBtn.addEventListener('click', () => this.logout());
    
    // Navigation
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });
    
    // Client management
    this.addClientBtn.addEventListener('click', () => this.openClientModal());
    this.clientForm.addEventListener('submit', (e) => this.handleClientSubmit(e));
    this.closeModal.addEventListener('click', () => this.closeClientModal());
    this.cancelClientBtn.addEventListener('click', () => this.closeClientModal());
    this.clientSearch.addEventListener('input', (e) => this.filterClients(e.target.value));
    this.clientsList.addEventListener('click', (e) => this.handleClientAction(e));
    
    // Stamps management
    this.clientSelect.addEventListener('change', (e) => this.selectClientForStamps(e.target.value));
    this.addStampBtn.addEventListener('click', () => this.addStamp());
    this.removeStampBtn.addEventListener('click', () => this.removeStamp());
    this.resetStampsBtn.addEventListener('click', () => this.resetStamps());
    
    // Modal close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === this.clientModal) this.closeClientModal();
    });
  }

  init() {
    this.loadClients();
    const adminUser = sessionStorage.getItem('adminUser');
    if (adminUser) {
      this.currentUser = JSON.parse(adminUser);
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  // Authentication
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

  showDashboard() {
    this.loginView.style.display = 'none';
    this.dashboard.style.display = 'block';
    this.renderClients();
    this.populateClientSelect();
  }

  // Navigation
  switchSection(section) {
    this.navButtons.forEach(btn => btn.classList.remove('active'));
    this.sections.forEach(sec => sec.style.display = 'none');
    
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    document.getElementById(`${section}-section`).style.display = 'block';
    
    if (section === 'stamps') {
      this.populateClientSelect();
    }
  }

  // Data management
  loadClients() {
    this.clients = JSON.parse(localStorage.getItem('loyaltyUsers')) || [];
  }

  saveClients() {
    localStorage.setItem('loyaltyUsers', JSON.stringify(this.clients));
  }

  // Client management
  renderClients() {
    this.clientsList.innerHTML = '';
    const filteredClients = this.getFilteredClients();
    
    filteredClients.forEach(client => {
      const clientCard = this.createClientCard(client);
      this.clientsList.appendChild(clientCard);
    });
  }

  createClientCard(client) {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.innerHTML = `
      <h4>${client.name}</h4>
      <p><strong>E-mail:</strong> ${client.email || 'Não informado'}</p>
      <p><strong>Telefone:</strong> ${client.phone}</p>
      <p><strong>Selos:</strong> ${client.stamps?.length || 0}/10</p>
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

  filterClients(searchTerm) {
    this.renderClients();
  }

  handleClientAction(e) {
    const action = e.target.dataset.action;
    const clientId = parseInt(e.target.dataset.id);
    
    if (action === 'edit') {
      this.editClient(clientId);
    } else if (action === 'delete') {
      this.deleteClient(clientId);
    }
  }

  openClientModal(client = null) {
    const modalTitle = document.getElementById('modal-title');
    const form = this.clientForm;
    
    if (client) {
      modalTitle.textContent = 'Editar Cliente';
      document.getElementById('client-id').value = client.id;
      document.getElementById('client-name').value = client.name;
      document.getElementById('client-email').value = client.email || '';
      document.getElementById('client-phone').value = client.phone;
      document.getElementById('client-password').value = client.password;
    } else {
      modalTitle.textContent = 'Novo Cliente';
      form.reset();
      document.getElementById('client-id').value = '';
    }
    
    this.clientModal.style.display = 'block';
  }

  closeClientModal() {
    this.clientModal.style.display = 'none';
    this.clientForm.reset();
  }

  handleClientSubmit(e) {
    e.preventDefault();
    
    const clientData = {
      name: document.getElementById('client-name').value.trim(),
      email: document.getElementById('client-email').value.trim(),
      phone: document.getElementById('client-phone').value.trim(),
      password: document.getElementById('client-password').value.trim()
    };
    
    const clientId = document.getElementById('client-id').value;
    
    if (clientId) {
      this.updateClient(parseInt(clientId), clientData);
    } else {
      this.createClient(clientData);
    }
  }

  createClient(clientData) {
    // Check if client already exists
    const existingClient = this.clients.find(c => 
      c.name.toLowerCase() === clientData.name.toLowerCase() ||
      (clientData.email && c.email === clientData.email)
    );
    
    if (existingClient) {
      alert('Cliente com este nome ou e-mail já existe!');
      return;
    }
    
    const newClient = {
      id: Date.now(),
      ...clientData,
      stamps: []
    };
    
    this.clients.push(newClient);
    this.saveClients();
    this.renderClients();
    this.populateClientSelect();
    this.closeClientModal();
    alert('Cliente cadastrado com sucesso!');
  }

  updateClient(clientId, clientData) {
    const clientIndex = this.clients.findIndex(c => c.id === clientId);
    if (clientIndex > -1) {
      this.clients[clientIndex] = { ...this.clients[clientIndex], ...clientData };
      this.saveClients();
      this.renderClients();
      this.populateClientSelect();
      this.closeClientModal();
      alert('Cliente atualizado com sucesso!');
    }
  }

  editClient(clientId) {
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      this.openClientModal(client);
    }
  }

  deleteClient(clientId) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clients = this.clients.filter(c => c.id !== clientId);
      this.saveClients();
      this.renderClients();
      this.populateClientSelect();
      alert('Cliente excluído com sucesso!');
    }
  }

  // Stamps management
  populateClientSelect() {
    this.clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    this.clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.name} (${client.stamps?.length || 0}/10 selos)`;
      this.clientSelect.appendChild(option);
    });
  }

  selectClientForStamps(clientId) {
    if (!clientId) {
      this.stampsManagement.style.display = 'none';
      this.selectedClient = null;
      return;
    }
    
    this.selectedClient = this.clients.find(c => c.id === parseInt(clientId));
    if (this.selectedClient) {
      this.selectedClientName.textContent = this.selectedClient.name;
      this.updateStampsDisplay();
      this.stampsManagement.style.display = 'block';
    }
  }

  updateStampsDisplay() {
    if (!this.selectedClient) return;
    
    const stampsCount = this.selectedClient.stamps?.length || 0;
    this.stampsCount.textContent = stampsCount;
    
    this.stampsGrid.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const slot = document.createElement('div');
      slot.className = 'stamp-slot';
      
      if (i < stampsCount) {
        slot.classList.add('filled');
        const stamp = this.selectedClient.stamps[i];
        const date = new Date(stamp.date);
        slot.innerHTML = `${date.toLocaleDateString('pt-BR')}<br>${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
      } else {
        slot.textContent = i + 1;
      }
      
      this.stampsGrid.appendChild(slot);
    }
  }

  addStamp() {
    if (!this.selectedClient) return;
    
    const stampsCount = this.selectedClient.stamps?.length || 0;
    if (stampsCount >= 10) {
      alert('Este cliente já possui o cartão completo!');
      return;
    }
    
    if (!this.selectedClient.stamps) {
      this.selectedClient.stamps = [];
    }
    
    this.selectedClient.stamps.push({
      date: new Date().toISOString(),
      addedBy: 'admin'
    });
    
    this.saveClients();
    this.updateStampsDisplay();
    this.populateClientSelect();
    alert('Selo adicionado com sucesso!');
  }

  removeStamp() {
    if (!this.selectedClient || !this.selectedClient.stamps?.length) {
      alert('Este cliente não possui selos para remover!');
      return;
    }
    
    if (confirm('Tem certeza que deseja remover o último selo?')) {
      this.selectedClient.stamps.pop();
      this.saveClients();
      this.updateStampsDisplay();
      this.populateClientSelect();
      alert('Selo removido com sucesso!');
    }
  }

  resetStamps() {
    if (!this.selectedClient) return;
    
    if (confirm(`Tem certeza que deseja resetar todos os selos de ${this.selectedClient.name}?`)) {
      this.selectedClient.stamps = [];
      this.saveClients();
      this.updateStampsDisplay();
      this.populateClientSelect();
      alert('Cartão resetado com sucesso!');
    }
  }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AdminManager();
});