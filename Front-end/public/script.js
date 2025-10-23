document.addEventListener('DOMContentLoaded', () => {
    // Views
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const cardView = document.getElementById('card-view');
    const adminView = document.getElementById('admin-view');

    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Buttons and Links
    const showRegisterLink = document.getElementById('go-to-register');
    const showLoginLink = document.getElementById('go-to-login');
    const addStampButton = document.getElementById('add-stamp-button');
    const logoutButton = document.getElementById('logout-button');
    const adminLogoutButton = document.getElementById('admin-logout-button');
    const exportDataButton = document.getElementById('export-data-button');
    
    // Other Elements
    const welcomeMessage = document.getElementById('user-name');
    const stampGrid = document.getElementById('stamp-grid');
    const rewardMessage = document.getElementById('reward-message');
    const userList = document.getElementById('user-list');

    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'admin123';
    
    let currentUser = null;

    // --- UTILITY FUNCTIONS ---
    const getDb = () => JSON.parse(localStorage.getItem('loyaltyUsers')) || [];
    const saveDb = (db) => localStorage.setItem('loyaltyUsers', JSON.stringify(db));
    const getCurrentUser = () => JSON.parse(sessionStorage.getItem('currentUser'));
    const setCurrentUser = (user) => sessionStorage.setItem('currentUser', JSON.stringify(user));
    const clearCurrentUser = () => sessionStorage.removeItem('currentUser');
    
    // --- VIEW MANAGEMENT ---
    const showView = (viewToShow) => {
        [loginView, registerView, cardView, adminView].forEach(view => {
            view.style.display = 'none';
        });
        viewToShow.style.display = 'flex';
    };

    // --- APP LOGIC ---
    const init = () => {
        const user = getCurrentUser();
        if (user) {
            currentUser = user;
            if (currentUser.name === ADMIN_USER) {
                renderAdminView();
            } else {
                renderCardView();
            }
        } else {
            showView(loginView);
        }
    };
    
    const registerUser = (name, phone, password) => {
        const db = getDb();
        if (db.find(user => user.name.toLowerCase() === name.toLowerCase())) {
            alert('Usuário com este nome já existe.');
            return;
        }
        const newUser = {
            id: Date.now(),
            name,
            phone,
            password,
            stamps: []
        };
        db.push(newUser);
        saveDb(db);
        alert('Cadastro realizado com sucesso!');
        showView(loginView);
        registerForm.reset();
    };

    const loginUser = (name, password) => {
        // Admin login
        if (name === ADMIN_USER && password === ADMIN_PASS) {
            currentUser = { name: ADMIN_USER };
            setCurrentUser(currentUser);
            renderAdminView();
            return;
        }

        // Regular user login
        const db = getDb();
        const user = db.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
        if (user) {
            currentUser = user;
            setCurrentUser(currentUser);
            renderCardView();
        } else {
            alert('Nome ou senha inválidos.');
        }
        loginForm.reset();
    };

    const logout = () => {
        currentUser = null;
        clearCurrentUser();
        showView(loginView);
    };
    
    const renderCardView = () => {
        welcomeMessage.textContent = `Olá, ${currentUser.name}!`;
        stampGrid.innerHTML = '';
        rewardMessage.style.display = 'none';

        const stampsCount = currentUser.stamps.length;
        
        for (let i = 0; i < 10; i++) {
            const stamp = document.createElement('div');
            stamp.classList.add('stamp');
            if (i < stampsCount) {
                stamp.classList.add('filled');
                const stampData = currentUser.stamps[i];
                const date = new Date(stampData.date);
                stamp.innerHTML = `<span>${date.toLocaleDateString('pt-BR')}</span><span>${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>`;
            }
            stampGrid.appendChild(stamp);
        }

        if (stampsCount >= 10) {
            addStampButton.style.display = 'none';
            rewardMessage.style.display = 'block';
        } else {
            addStampButton.style.display = 'block';
        }

        showView(cardView);
    };

    const addStamp = () => {
        if (currentUser.stamps.length >= 10) return;

        const db = getDb();
        const userIndex = db.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            const newStamp = { date: new Date().toISOString() };
            db[userIndex].stamps.push(newStamp);
            currentUser.stamps.push(newStamp);
            saveDb(db);
            setCurrentUser(currentUser);
            renderCardView();
        }
    };
    
    // --- ADMIN LOGIC ---
    const renderAdminView = () => {
        const db = getDb();
        userList.innerHTML = '';
        db.forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <h4>${user.name}</h4>
                <p><strong>Celular:</strong> ${user.phone}</p>
                <p><strong>Carimbos:</strong> ${user.stamps.length} / 10</p>
                <button class="reset-card-btn" data-userid="${user.id}">Resetar Cartão</button>
            `;
            userList.appendChild(card);
        });
        showView(adminView);
    };
    
    const resetUserCard = (userId) => {
        const db = getDb();
        const userIndex = db.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            db[userIndex].stamps = [];
            saveDb(db);
            renderAdminView();
            alert(`Cartão de ${db[userIndex].name} resetado.`);
        }
    };

    // --- EVENT LISTENERS ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView(registerView);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView(loginView);
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = registerForm.querySelectorAll('input');
        const name = inputs[0].value.trim();
        const phone = inputs[1].value.trim();
        const password = inputs[2].value.trim();
        if (name && phone && password) {
            registerUser(name, phone, password);
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const name = inputs[0].value.trim();
        const password = inputs[1].value.trim();
        if (name && password) {
            loginUser(name, password);
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    logoutButton.addEventListener('click', logout);
    adminLogoutButton.addEventListener('click', logout);
    addStampButton.addEventListener('click', addStamp);

    userList.addEventListener('click', (e) => {
        if (e.target.classList.contains('reset-card-btn')) {
            const userId = parseInt(e.target.dataset.userid, 10);
            if (confirm('Tem certeza que deseja resetar o cartão deste usuário?')) {
                resetUserCard(userId);
            }
        }
    });
    
    exportDataButton.addEventListener('click', () => {
        alert('Função de exportação de dados simulada.');
    });

    // --- INITIALIZE APP ---
    init();
});

