-- Tickets de suporte
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Mensagens dos tickets
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_admin_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- Políticas RLS para tickets de suporte
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios tickets
CREATE POLICY view_own_tickets ON support_tickets
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios tickets
CREATE POLICY create_own_tickets ON support_tickets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios tickets (apenas certos campos)
CREATE POLICY update_own_tickets ON support_tickets
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND 
                (OLD.status = 'open' OR OLD.status = 'in_progress') AND
                (NEW.status = 'open' OR NEW.status = 'closed'));

-- Políticas para administradores
CREATE POLICY admin_manage_all_tickets ON support_tickets
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Políticas RLS para mensagens de tickets
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem mensagens de seus próprios tickets
CREATE POLICY view_own_ticket_messages ON ticket_messages
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM support_tickets
        WHERE support_tickets.id = ticket_messages.ticket_id
        AND support_tickets.user_id = auth.uid()
    ));

-- Política para usuários adicionarem mensagens aos seus próprios tickets
CREATE POLICY add_message_to_own_ticket ON ticket_messages
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM support_tickets
            WHERE support_tickets.id = ticket_messages.ticket_id
            AND support_tickets.user_id = auth.uid()
            AND (support_tickets.status = 'open' OR support_tickets.status = 'in_progress')
        )
    );

-- Políticas para administradores
CREATE POLICY admin_manage_all_messages ON ticket_messages
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Inserir alguns dados de exemplo
INSERT INTO support_tickets (user_id, subject, description, priority, status)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'Problema de acesso à ferramenta X', 'Não consigo acessar a ferramenta X desde ontem. Aparece erro de credenciais.', 'high', 'open'),
    ('00000000-0000-0000-0000-000000000000', 'Dúvida sobre plano Premium', 'Gostaria de saber quais ferramentas estão incluídas no plano Premium.', 'medium', 'open'),
    ('00000000-0000-0000-0000-000000000000', 'Sugestão de nova ferramenta', 'Gostaria de sugerir a inclusão da ferramenta Y na plataforma.', 'low', 'open');

-- Inserir algumas mensagens de exemplo
INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin_reply)
VALUES 
    ((SELECT id FROM support_tickets WHERE subject = 'Problema de acesso à ferramenta X' LIMIT 1), 
     '00000000-0000-0000-0000-000000000000', 
     'Já tentei limpar o cache e usar outro navegador, mas o problema persiste.', 
     false),
    ((SELECT id FROM support_tickets WHERE subject = 'Problema de acesso à ferramenta X' LIMIT 1), 
     '00000000-0000-0000-0000-000000000000', 
     'Por favor, preciso de ajuda urgente pois tenho um prazo para entregar um trabalho.', 
     false);
