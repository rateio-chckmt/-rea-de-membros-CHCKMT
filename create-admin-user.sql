-- Verificar se o usuário já existe
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Verificar se o usuário já existe na tabela auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = 'tiago@tmtraffic.com';
    
    -- Se o usuário não existir, criar um novo
    IF user_id IS NULL THEN
        -- Inserir o usuário na tabela auth.users
        -- Nota: Não podemos inserir diretamente na tabela auth.users com senha
        -- Vamos usar a função auth.create_user do Supabase
        user_id := auth.uid();
        PERFORM auth.create_user(
            uid := user_id,
            email := 'tiago@tmtraffic.com',
            email_confirmed := true,
            password := '!123@456$789*',
            raw_user_meta_data := '{"name": "Tiago Admin"}'::jsonb
        );
        
        -- Verificar se o perfil já existe
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
            -- Inserir o perfil com role = 'admin'
            INSERT INTO public.profiles (id, full_name, role)
            VALUES (user_id, 'Tiago Admin', 'admin');
        ELSE
            -- Atualizar o perfil existente para role = 'admin'
            UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
        END IF;
    ELSE
        -- Se o usuário já existir, apenas atualizar o perfil para role = 'admin'
        UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
    END IF;
END $$;

-- Confirmar que o usuário foi criado e tem o papel de admin
SELECT u.email, p.full_name, p.role 
FROM auth.users u 
JOIN public.profiles p ON u.id = p.id 
WHERE u.email = 'tiago@tmtraffic.com';
