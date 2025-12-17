// ============================================
// SISTEMA DE AGENDAMENTO - ADMIN
// ============================================

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentTab = 'all';

// Verificar autenticação admin
function checkAuth() {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
        window.location.href = 'admin.html';
        return;
    }
    loadAllAppointments();
    loadBlockedSlots();
}

// Alternar tabs
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (tab === 'all') {
        document.querySelector('.tab:nth-child(1)').classList.add('active');
        document.getElementById('allTab').classList.add('active');
        loadAllAppointments();
    } else {
        document.querySelector('.tab:nth-child(2)').classList.add('active');
        document.getElementById('blockedTab').classList.add('active');
        loadBlockedSlots();
    }
}

// Carregar todos os agendamentos
async function loadAllAppointments() {
    try {
        let query = supabase
            .from('appointments')
            .select(`
                *,
                users:user_id (name, phone)
            `)
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true });

        const filterDate = document.getElementById('filterDate').value;
        const filterStatus = document.getElementById('filterStatus').value;

        if (filterDate) query = query.eq('appointment_date', filterDate);
        if (filterStatus) query = query.eq('status', filterStatus);

        const { data, error } = await query;
        if (error) throw error;

        const container = document.getElementById('allAppointmentsList');
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="color: #999;">Nenhum agendamento encontrado.</p>';
            return;
        }

        container.innerHTML = data.map(apt => `
            <div class="appointment-item ${apt.status}">
                <div>
                    <h3>${apt.service_name}</h3>
                    <p><strong>Cliente:</strong> ${apt.users?.name || 'N/A'} | 📞 ${apt.users?.phone || 'N/A'}</p>
                    <p>📅 ${formatDate(apt.appointment_date)} às ${apt.appointment_time}</p>
                    ${apt.notes ? `<p>📝 ${apt.notes}</p>` : ''}
                    <span class="status-badge status-${apt.status}">${getStatusText(apt.status)}</span>
                </div>
                <div>
                    ${apt.status === 'pending' ? `
                        <button class="btn btn-success" onclick="updateStatus('${apt.id}', 'confirmed')">Confirmar</button>
                        <button class="btn btn-danger" onclick="updateStatus('${apt.id}', 'cancelled')">Cancelar</button>
                    ` : ''}
                    ${apt.status === 'confirmed' ? `
                        <button class="btn btn-secondary" onclick="updateStatus('${apt.id}', 'completed')">Concluir</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        alert('Erro ao carregar agendamentos');
    }
}

// Atualizar status do agendamento
async function updateStatus(id, status) {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        alert(`Status atualizado para: ${getStatusText(status)}`);
        loadAllAppointments();
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status');
    }
}

// Carregar horários bloqueados
async function loadBlockedSlots() {
    try {
        const { data, error } = await supabase
            .from('blocked_slots')
            .select('*')
            .order('block_date', { ascending: true })
            .order('block_time', { ascending: true });

        if (error) throw error;

        const container = document.getElementById('blockedSlotsList');
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="color: #999;">Nenhum horário bloqueado.</p>';
            return;
        }

        container.innerHTML = data.map(slot => `
            <div class="blocked-item">
                <div>
                    <strong>📅 ${formatDate(slot.block_date)} às ${slot.block_time}</strong>
                    ${slot.reason ? `<br><small>${slot.reason}</small>` : ''}
                </div>
                <button class="btn btn-danger" onclick="unblockSlot('${slot.id}')">Desbloquear</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar bloqueios:', error);
        alert('Erro ao carregar horários bloqueados');
    }
}

// Mostrar modal de bloqueio
function showBlockModal() {
    document.getElementById('blockModal').style.display = 'block';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('blockDate').min = today;
}

// Fechar modal
function closeModal() {
    document.getElementById('blockModal').style.display = 'none';
    document.getElementById('blockForm').reset();
}

// Bloquear horário
document.getElementById('blockForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        block_date: document.getElementById('blockDate').value,
        block_time: document.getElementById('blockTime').value,
        reason: document.getElementById('blockReason').value || null
    };

    try {
        const { error } = await supabase.from('blocked_slots').insert([data]);
        if (error) throw error;

        alert('✅ Horário bloqueado com sucesso!');
        closeModal();
        loadBlockedSlots();
    } catch (error) {
        console.error('Erro ao bloquear horário:', error);
        if (error.code === '23505') {
            alert('Este horário já está bloqueado!');
        } else {
            alert('Erro ao bloquear horário');
        }
    }
});

// Desbloquear horário
async function unblockSlot(id) {
    if (!confirm('Deseja desbloquear este horário?')) return;

    try {
        const { error } = await supabase
            .from('blocked_slots')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Horário desbloqueado');
        loadBlockedSlots();
    } catch (error) {
        console.error('Erro ao desbloquear:', error);
        alert('Erro ao desbloquear horário');
    }
}

// Logout
function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'admin.html';
}

// Helpers
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function getStatusText(status) {
    const texts = {
        pending: 'Pendente',
        confirmed: 'Confirmado',
        cancelled: 'Cancelado',
        completed: 'Concluído'
    };
    return texts[status] || status;
}

// Inicializar
document.addEventListener('DOMContentLoaded', checkAuth);
