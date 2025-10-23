document.addEventListener('DOMContentLoaded', async () => {
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const cardView = document.getElementById('card-view');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const showRegisterLink = document.getElementById('go-to-register');
    const showLoginLink = document.getElementById('go-to-login');
    const addStampButton = document.getElementById('add-stamp-button');
    const logoutButton = document.getElementById('logout-button');
    
    const welcomeMessage = document.getElementById('user-name');
    const stampGrid = document.getElementById('stamp-grid');
    const rewardMessage = document.getElementById('reward-message');

    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'admin123';
    
    let currentUser = null;
    let userStamps = [];

    const showView = (viewToShow) => {
        [loginView, registerView, cardView].forEach(view => {
            view.style.display = 'none';
        });
        viewToShow.style.display = 'flex';
    };

    const init = async () => {
        const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
        if (user) {
            currentUser = user;
            if (currentUser.name === ADMIN_USER) {
                window.location.href = 'admin.html';
            } else {
                await renderCardView();
            }
        } else {
            showView(loginView);
        }
    };
    
    const registerUser = async (name, phone, password) => {
        try {
            const users = await Database.getUsers();
            if (users.find(user => user.name.toLowerCase() === name.toLowerCase())) {
                alert('Usuário com este nome já existe.');
                return;
            }
            
            await Database.createUser({ name, phone, password });
            alert('Cadastro realizado com sucesso!');
            showView(loginView);
            registerForm.reset();
        } catch (error) {
            alert('Erro ao cadastrar: ' + error.message);
        }
    };

    const loginUser = async (name, password) => {
        if (name === ADMIN_USER && password === ADMIN_PASS) {
            currentUser = { name: ADMIN_USER };
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'admin.html';
            return;
        }

        try {
            const users = await Database.getUsers();
            const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
            if (user) {
                currentUser = user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                await renderCardView();
            } else {
                alert('Nome ou senha inválidos.');
            }
        } catch (error) {
            alert('Erro ao fazer login: ' + error.message);
        }
        loginForm.reset();
    };

    const logout = () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        showView(loginView);
    };
    
    const renderCardView = async () => {
        try {
            welcomeMessage.textContent = currentUser.name;
            userStamps = await Database.getUserStamps(currentUser.id);
            
            stampGrid.innerHTML = '';
            rewardMessage.style.display = 'none';

            const stampsCount = userStamps.length;
            
            for (let i = 0; i < 10; i++) {
                const stamp = document.createElement('div');
                stamp.classList.add('stamp');
                if (i < stampsCount) {
                    stamp.classList.add('filled');
                    const stampData = userStamps[i];
                    const date = new Date(stampData.created_at);
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
        } catch (error) {
            alert('Erro ao carregar cartão: ' + error.message);
        }
    };

    const addStamp = async () => {
        if (userStamps.length >= 10) return;

        try {
            await Database.addStamp(currentUser.id, {
                created_at: new Date().toISOString()
            });
            await renderCardView();
        } catch (error) {
            alert('Erro ao adicionar selo: ' + error.message);
        }
    };

    // Event Listeners
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
    addStampButton.addEventListener('click', addStamp);

    await init();
});