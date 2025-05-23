-- Verificar se a tabela já existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        -- Criar tabela de notificações
        CREATE TABLE public.notifications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            link TEXT,
            icon TEXT,
            type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            read_at TIMESTAMP WITH TIME ZONE
        );

        -- Adicionar índices para melhorar performance
        CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);
        CREATE INDEX notifications_is_read_idx ON public.notifications(is_read);
        CREATE INDEX notifications_created_at_idx ON public.notifications(created_at);

        -- Configurar RLS (Row Level Security)
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

        -- Políticas de segurança
        CREATE POLICY "Usuários podem ver apenas suas próprias notificações"
            ON public.notifications FOR SELECT
            USING (auth.uid() = user_id);

        CREATE POLICY "Usuários podem atualizar apenas suas próprias notificações"
            ON public.notifications FOR UPDATE
            USING (auth.uid() = user_id);

        -- Função para enviar notificação para todos os usuários
        CREATE OR REPLACE FUNCTION public.send_notification_to_all_users(
            title TEXT,
            message TEXT,
            link TEXT,
            icon TEXT,
            type TEXT
        ) RETURNS VOID AS $$
        BEGIN
            INSERT INTO public.notifications (user_id, title, message, link, icon, type)
            SELECT id, title, message, link, icon, type
            FROM auth.users;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Função para enviar notificação para usuários com role específico
        CREATE OR REPLACE FUNCTION public.send_notification_by_role(
            title TEXT,
            message TEXT,
            link TEXT,
            icon TEXT,
            type TEXT,
            role TEXT
        ) RETURNS VOID AS $$
        BEGIN
            INSERT INTO public.notifications (user_id, title, message, link, icon, type)
            SELECT auth.users.id, title, message, link, icon, type
            FROM auth.users
            JOIN public.profiles ON auth.users.id = profiles.id
            WHERE profiles.role = role;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END
$$;

-- Adicionar permissões para o serviço anon
GRANT SELECT, UPDATE ON public.notifications TO anon;
GRANT USAGE ON SEQUENCE public.notifications_id_seq TO anon;
