// ============================================
// SISTEMA DE AGENDAMENTO - CLIENTE
// ============================================

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;
let selectedTime = null;

// Horários disponíveis (8h às 18h)
const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Verificar autenticação
async function checkAuth() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userStr);
    document.getElementById('userName').textContent = `Olá, ${currentUser.name}`;
    loadAppointments();
}

// Carregar agendamentos do usuário
async function loadAppointments() {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true });

        if (error) throw error;

        const container = document.getElementById('appointmentsList');
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="color: #999;">Nenhum agendamento encontrado.</p>';
            return;
        }

        container.innerHTML = data.map(apt => `
            <div class="appointment-item ${apt.status}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h3>${apt.service_name}</h3>
                        <p>📅 ${formatDate(apt.appointment_date)} às ${apt.appointment_time}</p>
                        ${apt.notes ? `<p>📝 ${apt.notes}</p>` : ''}
                        <span class="status-badge status-${apt.status}">${getStatusText(apt.status)}</span>
                    </div>
                    ${apt.status === 'pending' ? `
                        <button class="btn btn-danger" onclick="cancelAppointment('${apt.id}')">Cancelar</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        alert('Erro ao carregar agendamentos');
    }
}

// Mostrar modal de novo agendamento
function showNewAppointmentModal() {
    document.getElementById('newAppointmentModal').style.display = 'block';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    document.getElementById('appointmentDate').value = today;
    loadTimeSlots();
}

// Fechar modal
function closeModal() {
    document.getElementById('newAppointmentModal').style.display = 'none';
    document.getElementById('appointmentForm').reset();
    selectedTime = null;
}

// Carregar horários disponíveis
async function loadTimeSlots() {
    const date = document.getElementById('appointmentDate').value;
    if (!date) return;

    try {
        // Buscar horários bloqueados
        const { data: blocked } = await supabase
            .from('blocked_slots')
            .select('block_time')
            .eq('block_date', date);

        // Buscar horários já agendados
        const { data: booked } = await supabase
            .from('appointments')
            .select('appointment_time')
            .eq('appointment_date', date)
            .neq('status', 'cancelled');

        const blockedTimes = blocked?.map(b => b.block_time) || [];
        const bookedTimes = booked?.map(b => b.appointment_time) || [];
        const unavailable = [...blockedTimes, ...bookedTimes];

        const container = document.getElementById('timeSlots');
        container.innerHTML = availableTimes.map(time => {
            const isBlocked = unavailable.includes(time);
            return `
                <div class="time-slot ${isBlocked ? 'blocked' : ''}" 
                     onclick="${isBlocked ? '' : `selectTime('${time}')`}">
                    ${time}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar horários:', error);
    }
}

// Selecionar horário
function selectTime(time) {
    selectedTime = time;
    document.getElementById('appointmentTime').value = time;
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
        if (slot.textContent.trim() === time) {
            slot.classList.add('selected');
        }
    });
}

// Criar agendamento
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedTime) {
        alert('Selecione um horário');
        return;
    }

    const data = {
        user_id: currentUser.id,
        service_name: document.getElementById('serviceName').value,
        appointment_date: document.getElementById('appointmentDate').value,
        appointment_time: selectedTime,
        notes: document.getElementById('notes').value,
        status: 'pending'
    };

    try {
        const { error } = await supabase.from('appointments').insert([data]);
        if (error) throw error;

        alert('✅ Agendamento realizado com sucesso!');
        closeModal();
        loadAppointments();
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        alert('Erro ao criar agendamento. Tente novamente.');
    }
});

// Cancelar agendamento
async function cancelAppointment(id) {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return;

    try {
        const { error } = await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', id);

        if (error) throw error;

        alert('Agendamento cancelado');
        loadAppointments();
    } catch (error) {
        console.error('Erro ao cancelar:', error);
        alert('Erro ao cancelar agendamento');
    }
}

// Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
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

// Atualizar horários quando mudar a data
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', loadTimeSlots);
    }
});
