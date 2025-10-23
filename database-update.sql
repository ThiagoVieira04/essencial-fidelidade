-- Adicionar coluna role na tabela users (opcional)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Criar usuário admin padrão (se não existir)
INSERT INTO users (name, phone, password, role) 
SELECT 'admin', '00000000000', 'admin123', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'admin');