// ============================================
// SISTEMA DE NOTIFICAÇÕES/LEMBRETES
// Usando Web Notifications API (100% gratuito)
// ============================================

// Solicitar permissão para notificações
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Este navegador não suporta notificações');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// Enviar notificação local
function sendLocalNotification(title, body, icon = 'assets/logo.png') {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon,
            badge: icon,
            vibrate: [200, 100, 200]
        });
    }
}

// Verificar agendamentos próximos (executar diariamente)
async function checkUpcomingAppointments() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .eq('appointment_date', tomorrowStr)
            .eq('status', 'confirmed');

        if (error) throw error;

        if (data && data.length > 0) {
            data.forEach(apt => {
                sendLocalNotification(
                    '🔔 Lembrete de Agendamento',
                    `Você tem ${apt.service_name} amanhã às ${apt.appointment_time}`,
                    'assets/logo.png'
                );
            });
        }
    } catch (error) {
        console.error('Erro ao verificar agendamentos:', error);
    }
}

// Agendar verificação diária (ao carregar a página)
function initNotificationService() {
    requestNotificationPermission();
    
    // Verificar imediatamente
    checkUpcomingAppointments();
    
    // Verificar a cada 24 horas
    setInterval(checkUpcomingAppointments, 24 * 60 * 60 * 1000);
}

// Notificar quando agendamento for confirmado
function notifyAppointmentConfirmed(appointment) {
    sendLocalNotification(
        '✅ Agendamento Confirmado',
        `Seu agendamento de ${appointment.service_name} foi confirmado para ${appointment.appointment_date} às ${appointment.appointment_time}`
    );
}

// Exportar funções
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        requestNotificationPermission,
        sendLocalNotification,
        checkUpcomingAppointments,
        initNotificationService,
        notifyAppointmentConfirmed
    };
}
