-- ============================================
-- SISTEMA DE AGENDAMENTO - ESSENCIAL FIDELIDADE
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Horários Bloqueados (Admin)
CREATE TABLE IF NOT EXISTS blocked_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    block_date DATE NOT NULL,
    block_time TIME NOT NULL,
    reason VARCHAR(200),
    created_by VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(block_date, block_time)
);

-- Índices para performance
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_blocked_date ON blocked_slots(block_date);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Usuários veem apenas seus agendamentos
CREATE POLICY "Users can view own appointments"
    ON appointments FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own appointments"
    ON appointments FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete own appointments"
    ON appointments FOR DELETE
    USING (true);

-- Políticas RLS: Todos podem ver horários bloqueados
CREATE POLICY "Anyone can view blocked slots"
    ON blocked_slots FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert blocked slots"
    ON blocked_slots FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can delete blocked slots"
    ON blocked_slots FOR DELETE
    USING (true);

-- Inserir serviços padrão (opcional)
COMMENT ON TABLE appointments IS 'Agendamentos de clientes';
COMMENT ON TABLE blocked_slots IS 'Horários bloqueados pelo administrador';
