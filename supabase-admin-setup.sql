-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir admin padrão (senha: admin123)
-- IMPORTANTE: Em produção, usar hash bcrypt
INSERT INTO admins (username, password) 
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

-- RLS (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Admins can read all admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Admins can update admins" ON admins FOR UPDATE USING (true);

-- Comentários
COMMENT ON TABLE admins IS 'Tabela de administradores do sistema';
COMMENT ON COLUMN admins.username IS 'Nome de usuário único do administrador';
COMMENT ON COLUMN admins.password IS 'Senha do administrador (deve ser hash em produção)';
