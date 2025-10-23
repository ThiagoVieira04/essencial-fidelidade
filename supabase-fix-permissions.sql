-- CORREÇÃO DE PERMISSÕES SUPABASE
-- Execute este script no SQL Editor do Supabase para corrigir o erro "Acesso negado"

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can insert users" ON users;
DROP POLICY IF EXISTS "Users can update users" ON users;
DROP POLICY IF EXISTS "Users can delete users" ON users;

DROP POLICY IF EXISTS "Users can read all stamps" ON stamps;
DROP POLICY IF EXISTS "Users can insert stamps" ON stamps;
DROP POLICY IF EXISTS "Users can update stamps" ON stamps;
DROP POLICY IF EXISTS "Users can delete stamps" ON stamps;

-- Criar políticas mais permissivas para administração
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on stamps" ON stamps
  FOR ALL USING (true) WITH CHECK (true);

-- Alternativamente, se quiser desabilitar RLS completamente (mais simples):
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE stamps DISABLE ROW LEVEL SECURITY;