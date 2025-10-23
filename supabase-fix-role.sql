-- Adicionar coluna role na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Atualizar usuários existentes
UPDATE users SET role = 'user' WHERE role IS NULL;