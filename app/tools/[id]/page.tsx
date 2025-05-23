import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import ToolPage from "@/components/tools/tool-page"

// Lista de ferramentas
const tools = [
  {
    id: "chatgpt",
    name: "Chat GPT",
    description: "Assistente de IA avançado para conversas e geração de texto",
    icon: "/chatgpt-logo-inspired.png",
    url: "https://chat.openai.com",
    longDescription:
      "O ChatGPT é um modelo de linguagem avançado desenvolvido pela OpenAI. Ele pode gerar texto semelhante ao humano, responder perguntas, auxiliar na escrita criativa, fornecer informações e muito mais. É uma ferramenta versátil para comunicação, criação de conteúdo e resolução de problemas.",
    features: [
      "Conversas naturais e contextuais",
      "Geração de texto criativo e informativo",
      "Resposta a perguntas complexas",
      "Auxílio em programação e debugging",
      "Tradução e resumo de textos",
    ],
  },
  {
    id: "sora",
    name: "SORA",
    description: "Gerador de vídeos realistas a partir de descrições textuais",
    icon: "/sora-openai-logo.png",
    url: "https://openai.com/sora",
    longDescription:
      "SORA é um modelo de IA da OpenAI capaz de criar vídeos realistas e imaginativos a partir de instruções textuais. Ele pode gerar cenas complexas com múltiplos personagens, tipos específicos de movimento e detalhes precisos do assunto e do plano de fundo, compreendendo não apenas o que o usuário pede, mas também como essas coisas existem no mundo físico.",
    features: [
      "Geração de vídeos realistas a partir de texto",
      "Criação de cenas complexas com múltiplos elementos",
      "Compreensão de física e movimento natural",
      "Manutenção da consistência de personagens e objetos",
      "Simulação de diferentes estilos visuais",
    ],
  },
  {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "Assistente de IA conversacional com foco em segurança e utilidade",
    icon: "/claude-anthropic-logo.png",
    url: "https://claude.ai",
    longDescription:
      "Claude é um assistente de IA desenvolvido pela Anthropic, projetado para ser útil, inofensivo e honesto. Ele pode conversar naturalmente, responder perguntas, resumir documentos, escrever conteúdo criativo e muito mais. Claude foi treinado para ser particularmente seguro e alinhado com valores humanos.",
    features: [
      "Conversas naturais e contextuais",
      "Processamento de documentos longos",
      "Respostas seguras e alinhadas com valores humanos",
      "Capacidade de admitir limitações de conhecimento",
      "Suporte a múltiplos formatos de entrada",
    ],
  },
  {
    id: "canva-pro",
    name: "Canva PRO",
    description: "Plataforma de design gráfico com recursos premium",
    icon: "/canva-pro-logo.png",
    url: "https://canva.com",
    longDescription:
      "Canva PRO é a versão premium da popular plataforma de design gráfico Canva. Oferece acesso a milhões de fotos, elementos, fontes e modelos premium, além de recursos avançados como remoção de fundo, redimensionamento mágico e ferramentas de colaboração em equipe. É ideal para criação de conteúdo visual profissional sem necessidade de conhecimentos avançados em design.",
    features: [
      "Acesso a mais de 100 milhões de fotos, elementos e modelos premium",
      "Ferramenta de remoção de fundo com um clique",
      "Redimensionamento mágico para adaptar designs a diferentes formatos",
      "Recursos de colaboração em equipe em tempo real",
      "Programação e publicação de conteúdo em redes sociais",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Modelo multimodal avançado do Google para texto, imagens e mais",
    icon: "/placeholder.svg?height=64&width=64&query=Gemini Google logo",
    url: "https://gemini.google.com",
    longDescription:
      "Gemini é o modelo de IA mais avançado do Google, capaz de compreender e combinar diferentes tipos de informação, incluindo texto, código, áudio, imagens e vídeo. Disponível em diferentes tamanhos (Ultra, Pro e Nano), o Gemini pode realizar tarefas complexas, desde análise de documentos até geração de código e criação de conteúdo criativo.",
    features: [
      "Compreensão e geração multimodal (texto, imagens, áudio)",
      "Raciocínio avançado e resolução de problemas",
      "Assistência em programação e debugging",
      "Análise e resumo de documentos complexos",
      "Integração com outros serviços Google",
    ],
  },
  {
    id: "v0-dev",
    name: "V0.dev",
    description: "Plataforma para criação de interfaces com IA da Vercel",
    icon: "/placeholder.svg?height=64&width=64&query=V0.dev Vercel logo",
    url: "https://v0.dev",
    longDescription:
      "V0.dev é uma ferramenta de design generativo da Vercel que permite criar componentes de UI e páginas web completas usando inteligência artificial. Com uma simples descrição textual, você pode gerar interfaces React responsivas e acessíveis, baseadas no framework Shadcn/UI. O código gerado pode ser facilmente integrado em projetos Next.js.",
    features: [
      "Geração de componentes React a partir de descrições textuais",
      "Criação de páginas web completas e responsivas",
      "Baseado no framework Shadcn/UI para design consistente",
      "Exportação direta para projetos Next.js",
      "Personalização e edição do código gerado",
    ],
  },
  {
    id: "capcut",
    name: "CapCut",
    description: "Editor de vídeo profissional com recursos de IA",
    icon: "/placeholder.svg?height=64&width=64&query=CapCut logo",
    url: "https://capcut.com",
    longDescription:
      "CapCut é um editor de vídeo profissional com recursos avançados de IA, disponível para desktop e dispositivos móveis. Oferece ferramentas de edição intuitivas, efeitos visuais, transições, correção de cor, remoção de fundo em vídeos, e recursos de IA como geração de legendas automáticas e estabilização de imagem. É amplamente utilizado por criadores de conteúdo para redes sociais.",
    features: [
      "Interface intuitiva para edição de vídeo profissional",
      "Recursos de IA para remoção de fundo e geração de legendas",
      "Biblioteca extensa de efeitos, transições e filtros",
      "Ferramentas de correção de cor e áudio avançadas",
      "Versões para desktop e dispositivos móveis",
    ],
  },
  {
    id: "designrr-io",
    name: "Designrr IO",
    description: "Ferramenta para converter conteúdo em ebooks e materiais digitais",
    icon: "/placeholder.svg?height=64&width=64&query=Designrr IO logo",
    url: "https://designrr.io",
    longDescription:
      "Designrr IO é uma plataforma que permite transformar facilmente conteúdo existente em ebooks, relatórios, white papers e outros materiais digitais profissionais. Pode importar conteúdo de blogs, documentos, PDFs, podcasts e até transcrever vídeos, convertendo-os em publicações digitais atraentes com design profissional e pronta para distribuição.",
    features: [
      "Conversão de blogs, artigos e PDFs em ebooks profissionais",
      "Transcrição de podcasts e vídeos para conteúdo escrito",
      "Centenas de modelos profissionais personalizáveis",
      "Edição de conteúdo com interface drag-and-drop",
      "Exportação em múltiplos formatos (PDF, EPUB, Kindle)",
    ],
  },
  {
    id: "image-fx-google",
    name: "Image FX Google",
    description: "Gerador de imagens com IA do Google",
    icon: "/placeholder.svg?height=64&width=64&query=Image FX Google logo",
    url: "https://labs.google/imagefx",
    longDescription:
      "ImageFX é uma ferramenta experimental do Google AI que permite criar imagens a partir de descrições textuais. Utilizando o modelo Imagen 2, a ferramenta gera imagens de alta qualidade baseadas em prompts, com controles para ajustar o estilo e a composição. Inclui recursos como edição de imagens existentes e variações a partir de uma imagem base.",
    features: [
      "Geração de imagens a partir de descrições textuais",
      "Controles de estilo e composição",
      "Edição e variações de imagens existentes",
      "Interface intuitiva e fácil de usar",
      "Integração com outros produtos Google",
    ],
  },
  {
    id: "music-fx-google",
    name: "Music FX Google",
    description: "Criador de música com IA do Google",
    icon: "/placeholder.svg?height=64&width=64&query=Music FX Google logo",
    url: "https://labs.google/musicfx",
    longDescription:
      "MusicFX é uma ferramenta experimental do Google AI que permite criar música original a partir de descrições textuais. Utilizando modelos avançados de IA, a ferramenta pode gerar composições musicais em diversos estilos e gêneros, com controles para ajustar o tom, ritmo e instrumentação. As músicas geradas podem ser usadas em projetos pessoais e criativos.",
    features: [
      "Geração de música a partir de descrições textuais",
      "Controles para ajustar estilo, ritmo e instrumentação",
      "Criação de faixas completas de 30 segundos",
      "Suporte a diversos gêneros musicais",
      "Exportação em formato de áudio de alta qualidade",
    ],
  },
  {
    id: "notebook-lm-google",
    name: "Notebook LM Google",
    description: "Ambiente de trabalho com IA para pesquisa e escrita",
    icon: "/placeholder.svg?height=64&width=64&query=Notebook LM Google logo",
    url: "https://notebooklm.google",
    longDescription:
      "NotebookLM é uma ferramenta do Google AI que transforma a maneira como as pessoas trabalham com informações. Permite carregar documentos e conversar com eles através de IA, facilitando a pesquisa, síntese e geração de novos insights. É ideal para pesquisadores, estudantes e profissionais que precisam extrair conhecimento de grandes volumes de texto.",
    features: [
      "Carregamento e análise de documentos com IA",
      "Conversas contextuais com seus próprios documentos",
      "Geração de resumos, insights e conteúdo relacionado",
      "Citações precisas das fontes originais",
      "Organização de informações em notas estruturadas",
    ],
  },
  {
    id: "whisk-google-fx",
    name: "Whisk Google FX",
    description: "Assistente de culinária e planejamento de refeições com IA",
    icon: "/placeholder.svg?height=64&width=64&query=Whisk Google FX logo",
    url: "https://whisk.com",
    longDescription:
      "Whisk é uma plataforma de planejamento de refeições potencializada por IA que ajuda a descobrir, organizar e preparar receitas. Integrada com tecnologia do Google, a ferramenta permite salvar receitas de qualquer site, criar listas de compras inteligentes, planejar refeições semanais e até mesmo adaptar receitas às suas preferências dietéticas e ingredientes disponíveis.",
    features: [
      "Salvamento de receitas de qualquer site com um clique",
      "Criação automática de listas de compras baseadas em receitas",
      "Planejamento de refeições semanal personalizado",
      "Adaptação de receitas para dietas específicas",
      "Comunidade para compartilhamento de receitas e dicas",
    ],
  },
]

export default async function ToolDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Encontrar a ferramenta pelo ID
  const tool = tools.find((t) => t.id === params.id)

  if (!tool) {
    redirect("/dashboard")
  }

  return <ToolPage tool={tool} />
}
