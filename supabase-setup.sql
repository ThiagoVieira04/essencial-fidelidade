-- Criar tabela de usuários
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de selos
CREATE TABLE stamps (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_stamps_user_id ON stamps(user_id);

-- RLS (Row Level Security) - opcional para segurança
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can delete users" ON users FOR DELETE USING (true);

CREATE POLICY "Users can read all stamps" ON stamps FOR SELECT USING (true);
CREATE POLICY "Users can insert stamps" ON stamps FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update stamps" ON stamps FOR UPDATE USING (true);
CREATE POLICY "Users can delete stamps" ON stamps FOR DELETE USING (true);