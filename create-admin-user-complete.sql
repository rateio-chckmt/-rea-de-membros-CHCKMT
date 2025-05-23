-- Criar o usuário na tabela auth.users
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Criar o usuário com a função auth.create_user
    SELECT auth.create_user(
        email := 'tiago@tmtraffic.com',
        password := '!123@456$789*',
        email_confirmed := true,
        data := '{"full_name": "Tiago Admin"}'::jsonb
    ) INTO new_user_id;
    
    -- Inserir o perfil com role = 'admin'
    INSERT INTO public.profiles (
        id, 
        full_name, 
        role
    ) VALUES (
        new_user_id, 
        'Tiago Admin', 
        'admin'
    );
    
    -- Mostrar o ID do usuário criado
    RAISE NOTICE 'Usuário criado com ID: %', new_user_id;
END $$;

-- Verificar se o usuário foi criado
SELECT u.id, u.email, p.role 
FROM auth.users u 
JOIN public.profiles p ON u.id = p.id 
WHERE u.email = 'tiago@tmtraffic.com';
