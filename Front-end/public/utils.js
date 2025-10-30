/**
 * Utilitários - Validação e Segurança
 * Mantém funcionalidades existentes, adiciona camada de proteção
 */

const Utils = {
  // Validação de entrada
  validateName(name) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    if (trimmed.length > 100) return { valid: false, error: 'Nome muito longo' };
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) return { valid: false, error: 'Nome deve conter apenas letras' };
    return { valid: true, value: trimmed };
  },

  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 11) {
      return { valid: false, error: 'Telefone inválido (use DDD + número)' };
    }
    return { valid: true, value: cleaned };
  },

  validatePassword(password) {
    if (password.length < 6) return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' };
    if (password.length > 50) return { valid: false, error: 'Senha muito longa' };
    return { valid: true, value: password };
  },

  validateEmail(email) {
    if (!email) return { valid: true, value: '' }; // Email opcional
    const trimmed = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed)) return { valid: false, error: 'E-mail inválido' };
    return { valid: true, value: trimmed.toLowerCase() };
  },

  // Hash simples (melhor que texto plano, mas não substitui bcrypt em produção)
  // Mantém compatibilidade com senhas existentes
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  // Sanitização XSS básica
  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Formatação de telefone para exibição
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  // Debounce para busca
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Toast notification (substitui alerts)
  showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Loading state
  showLoading(element, show = true) {
    if (show) {
      element.classList.add('loading');
      element.disabled = true;
      element.dataset.originalText = element.textContent;
      element.textContent = 'Carregando...';
    } else {
      element.classList.remove('loading');
      element.disabled = false;
      element.textContent = element.dataset.originalText || element.textContent;
    }
  }
};
