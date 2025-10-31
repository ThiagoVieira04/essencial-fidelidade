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
    
    const registerUser = async (name, phone, password, submitBtn) => {
        // Validações
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
        
        Utils.showLoading(submitBtn, true);
        
        try {
            const users = await Database.getUsers();
            if (users.find(user => user.name.toLowerCase() === nameValidation.value.toLowerCase())) {
                Utils.showToast('Usuário com este nome já existe', 'error');
                return;
            }
            
            await Database.createUser({ 
                name: nameValidation.value, 
                phone: phoneValidation.value, 
                password: passwordValidation.value 
            });
            
            Utils.showToast('Cadastro realizado com sucesso!', 'success');
            showView(loginView);
            registerForm.reset();
        } catch (error) {
            console.error('Erro no cadastro:', error);
            Utils.showToast(error.message || 'Erro ao cadastrar', 'error');
        } finally {
            Utils.showLoading(submitBtn, false);
        }
    };

    const loginUser = async (name, password, submitBtn) => {
        const nameValidation = Utils.validateName(name);
        const passwordValidation = Utils.validatePassword(password);
        
        if (!nameValidation.valid || !passwordValidation.valid) {
            Utils.showToast('Preencha os campos corretamente', 'error');
            return;
        }
        
        Utils.showLoading(submitBtn, true);
        
        try {
            // Admin login
            if (nameValidation.value === ADMIN_USER && passwordValidation.value === ADMIN_PASS) {
                currentUser = { name: ADMIN_USER };
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'admin.html';
                return;
            }

            // User login
            const users = await Database.getUsers();
            const user = users.find(u => 
                u.name.toLowerCase() === nameValidation.value.toLowerCase() && 
                u.password === passwordValidation.value
            );
            
            if (user) {
                currentUser = user;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                await renderCardView();
                Utils.showToast(`Bem-vindo, ${user.name}!`, 'success');
            } else {
                Utils.showToast('Nome ou senha inválidos', 'error');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            Utils.showToast(error.message || 'Erro ao fazer login', 'error');
        } finally {
            Utils.showLoading(submitBtn, false);
            loginForm.reset();
        }
    };

    const logout = () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        showView(loginView);
    };
    
    const renderCardView = async () => {
        try {
            if (!welcomeMessage || !stampGrid || !rewardMessage) {
                throw new Error('Elementos não encontrados');
            }
            
            welcomeMessage.textContent = Utils.sanitizeHTML(currentUser.name);
            userStamps = await Database.getUserStamps(currentUser.id);
            
            stampGrid.innerHTML = '';
            rewardMessage.style.display = 'none';

            const stampsCount = userStamps.length;
            
            // Criar fragmento para melhor performance
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < 10; i++) {
                const stamp = document.createElement('div');
                stamp.classList.add('stamp');
                stamp.setAttribute('aria-label', `Selo ${i + 1}`);
                
                if (i < stampsCount) {
                    stamp.classList.add('filled');
                    const stampData = userStamps[i];
                    const date = new Date(stampData.created_at);
                    stamp.innerHTML = `<span>${date.toLocaleDateString('pt-BR')}</span><span>${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>`;
                    stamp.setAttribute('aria-label', `Selo ${i + 1} preenchido em ${date.toLocaleDateString('pt-BR')}`);
                }
                fragment.appendChild(stamp);
            }
            
            stampGrid.appendChild(fragment);

            if (stampsCount >= 10) {
                if (addStampButton) addStampButton.style.display = 'none';
                rewardMessage.style.display = 'block';
                rewardMessage.setAttribute('role', 'alert');
            } else {
                if (addStampButton) addStampButton.style.display = 'block';
            }

            showView(cardView);
        } catch (error) {
            console.error('Erro ao renderizar cartão:', error);
            Utils.showToast(error.message || 'Erro ao carregar cartão', 'error');
        }
    };

    const addStamp = async () => {
        if (userStamps.length >= 10) {
            Utils.showToast('Cartão já está completo!', 'warning');
            return;
        }

        if (addStampButton) Utils.showLoading(addStampButton, true);
        
        try {
            await Database.addStamp(currentUser.id, {
                created_at: new Date().toISOString()
            });
            await renderCardView();
            Utils.showToast('Selo adicionado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao adicionar selo:', error);
            Utils.showToast(error.message || 'Erro ao adicionar selo', 'error');
        } finally {
            if (addStampButton) Utils.showLoading(addStampButton, false);
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
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        if (name && phone && password) {
            registerUser(name, phone, password, submitBtn);
        } else {
            Utils.showToast('Por favor, preencha todos os campos', 'warning');
        }
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const name = inputs[0].value.trim();
        const password = inputs[1].value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        if (name && password) {
            loginUser(name, password, submitBtn);
        } else {
            Utils.showToast('Por favor, preencha todos os campos', 'warning');
        }
    });

    logoutButton.addEventListener('click', logout);
    if (addStampButton) addStampButton.addEventListener('click', addStamp);

    // Toggle password visibility - Login
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    
    if (toggleLoginPassword) {
        const togglePasswordHandler = function(event) {
            if (event.type === 'touchstart') event.stopPropagation();
            
            const passwordInput = toggleLoginPassword.parentElement.querySelector('input[type="password"], input[type="text"]');
            const eyeIcon = toggleLoginPassword.querySelector('.eye-icon');
            
            if (passwordInput && passwordInput.placeholder === 'Senha') {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.textContent = '🙈';
                    toggleLoginPassword.setAttribute('aria-label', 'Ocultar senha');
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.textContent = '👁️';
                    toggleLoginPassword.setAttribute('aria-label', 'Mostrar senha');
                }
            }
        };
        
        toggleLoginPassword.addEventListener('click', togglePasswordHandler);
        toggleLoginPassword.addEventListener('touchstart', togglePasswordHandler, { passive: true });
    }

    // Toggle password visibility - Cadastro
    const toggleRegisterPassword = document.getElementById('toggle-register-password');
    
    if (toggleRegisterPassword) {
        const togglePasswordHandler = function(event) {
            if (event.type === 'touchstart') event.stopPropagation();
            
            const passwordInput = toggleRegisterPassword.parentElement.querySelector('input[type="password"], input[type="text"]');
            const eyeIcon = toggleRegisterPassword.querySelector('.eye-icon');
            
            if (passwordInput && passwordInput.placeholder === 'Senha') {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.textContent = '🙈';
                    toggleRegisterPassword.setAttribute('aria-label', 'Ocultar senha');
                } else {
                    passwordInput.type = 'password';
                    eyeIcon.textContent = '👁️';
                    toggleRegisterPassword.setAttribute('aria-label', 'Mostrar senha');
                }
            }
        };
        
        toggleRegisterPassword.addEventListener('click', togglePasswordHandler);
        toggleRegisterPassword.addEventListener('touchstart', togglePasswordHandler, { passive: true });
    }

    await init();
});