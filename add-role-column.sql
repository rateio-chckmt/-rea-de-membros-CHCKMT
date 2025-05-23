-- Adicionar coluna role à tabela profiles
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.profiles.role IS 'Papel do usuário: user, admin';

-- Criar índice para consultas baseadas em role mais rápidas
CREATE INDEX idx_profiles_role ON public.profiles(role);
