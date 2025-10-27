// Theme Manager
const ThemeManager = {
    init() {
        this.loadTheme();
        this.createToggleButton();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateToggleIcon();
    },

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Alternar tema');
        button.innerHTML = this.getIcon();
        button.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(button);
    },

    updateToggleIcon() {
        const button = document.querySelector('.theme-toggle');
        if (button) button.innerHTML = this.getIcon();
    },

    getIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? '☀️' : '🌙';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
