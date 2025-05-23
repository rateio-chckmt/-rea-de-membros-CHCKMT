-- Obter o ID do usuário recém-criado
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Obter o ID do usuário pelo email
    SELECT id INTO user_id FROM auth.users WHERE email = 'tiago@tmtraffic.com';
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário com email tiago@tmtraffic.com não encontrado';
    END IF;
    
    -- Verificar se já existe um perfil para este usuário
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
        -- Atualizar o perfil existente
        UPDATE public.profiles 
        SET role = 'admin', full_name = 'Tiago Admin'
        WHERE id = user_id;
    ELSE
        -- Inserir um novo perfil
        INSERT INTO public.profiles (id, full_name, role)
        VALUES (user_id, 'Tiago Admin', 'admin');
    END IF;
    
    RAISE NOTICE 'Usuário atualizado com sucesso. ID: %', user_id;
END $$;

-- Verificar se o usuário foi atualizado corretamente
SELECT u.id, u.email, p.full_name, p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'tiago@tmtraffic.com';
