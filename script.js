document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {
        signup: document.getElementById('signup-screen'),
        login: document.getElementById('login-screen'),
        card: document.getElementById('card-screen'),
    };

    const forms = {
        signup: document.getElementById('signup-form'),
        login: document.getElementById('login-form'),
    };

    const links = {
        gotoLogin: document.getElementById('goto-login'),
        gotoSignup: document.getElementById('goto-signup'),
    };

    const cardElements = {
        welcomeUser: document.getElementById('welcome-user'),
        stampCard: document.getElementById('stamp-card'),
        prizeMessage: document.getElementById('prize-message'),
        redeemBtn: document.getElementById('redeem-prize'),
        addStampBtn: document.getElementById('add-stamp-btn'),
        adminControls: document.getElementById('admin-controls'),
        logoutBtn: document.getElementById('logout-btn'),
    };
    
    const STAMPS_REQUIRED = 10;
    let currentUser = null;

    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('ServiceWorker registration successful with scope: ', registration.scope))
                .catch(err => console.log('ServiceWorker registration failed: ', err));
        });
    }

    // --- Screen Navigation ---
    const showScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    };

    links.gotoLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login');
    });

    links.gotoSignup.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('signup');
    });
    
    cardElements.logoutBtn.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        showScreen('login');
    });


    // --- User Management (localStorage) ---
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || {};

    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

    const findUser = (phone) => getUsers()[phone];

    const saveUser = (user) => {
        const users = getUsers();
        users[user.phone] = user;
        saveUsers(users);
    };
    
    const login = (phone, password) => {
        const user = findUser(phone);
        if (user && user.password === password) {
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        }
        return false;
    };

    // --- Form Handling ---
    forms.signup.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target['signup-name'].value;
        const phone = e.target['signup-phone'].value;
        const password = e.target['signup-password'].value;

        if (findUser(phone)) {
            alert('Este número de celular já está cadastrado.');
            return;
        }

        const newUser = { name, phone, password, stamps: 0 };
        saveUser(newUser);
        currentUser = newUser;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        forms.signup.reset();
        renderCardScreen();
        showScreen('card');
    });

    forms.login.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = e.target['login-user'].value;
        const password = e.target['login-password'].value;

        if (login(phone, password)) {
            forms.login.reset();
            renderCardScreen();
            showScreen('card');
        } else {
            alert('Usuário ou senha inválidos.');
        }
    });

    // --- Loyalty Card Logic ---
    const renderCardScreen = () => {
        if (!currentUser) return;

        cardElements.welcomeUser.textContent = `Olá, ${currentUser.name.split(' ')[0]}!`;
        cardElements.stampCard.innerHTML = '';

        for (let i = 0; i < STAMPS_REQUIRED; i++) {
            const stamp = document.createElement('div');
            stamp.className = 'stamp';
            const stampImg = document.createElement('img');
            stampImg.src = '/shirley logo (1).png';
            stampImg.alt = 'Selo';
            stamp.appendChild(stampImg);
            if (i < currentUser.stamps) {
                stamp.classList.add('filled');
            }
            cardElements.stampCard.appendChild(stamp);
        }
        
        // Admin controls (for demo) - a real app would have proper auth for this
        cardElements.adminControls.classList.remove('hidden');

        if (currentUser.stamps >= STAMPS_REQUIRED) {
            cardElements.prizeMessage.classList.remove('hidden');
            cardElements.addStampBtn.classList.add('hidden');
        } else {
            cardElements.prizeMessage.classList.add('hidden');
            cardElements.addStampBtn.classList.remove('hidden');
        }
    };
    
    cardElements.addStampBtn.addEventListener('click', () => {
        if (!currentUser || currentUser.stamps >= STAMPS_REQUIRED) return;
        
        currentUser.stamps++;
        saveUser(currentUser);
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        renderCardScreen();
    });
    
    cardElements.redeemBtn.addEventListener('click', () => {
        if (!currentUser) return;
        
        currentUser.stamps = 0; // Reset stamps
        saveUser(currentUser);
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        renderCardScreen();
    });

    // --- App Initialization ---
    const checkLoggedIn = () => {
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            // Refresh user data from localStorage in case it changed
            const freshUserData = findUser(currentUser.phone);
            if(freshUserData) {
                currentUser = freshUserData;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            renderCardScreen();
            showScreen('card');
        } else {
            showScreen('login');
        }
    };

    checkLoggedIn();
});

