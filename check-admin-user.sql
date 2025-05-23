-- Verificar se o usuário existe na tabela auth.users
SELECT id, email, email_confirmed_at, last_sign_in_at, raw_user_meta_data
FROM auth.users 
WHERE email = 'tiago@tmtraffic.com';

-- Verificar se o perfil existe e tem o papel de admin
SELECT id, full_name, role
FROM public.profiles
WHERE id IN (SELECT id FROM auth.users WHERE email = 'tiago@tmtraffic.com');
