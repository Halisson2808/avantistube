// Interfaces para o sistema de planejamento de roteiros

export interface PlanejamentoRequest {
    projeto_id: string
    titulo?: string
    tema?: string
    nicho?: string
    tamanho_caracteres: number
    modelo_ia: string
}

export interface PlanejamentoResponse {
    success: boolean
    planejamento_id: string
    estrutura: EstruturaRoteiro
}

export interface EstruturaRoteiro {
    total_caracteres: number
    total_secoes: number
    total_chunks: number
    secoes: SecaoEstrutura[]
}

export interface SecaoEstrutura {
    nome: string
    ordem: number
    porcentagem: number
    caracteres_alvo: number
    objetivo: string
    chunks: number
    chunks_detalhes: ChunkEstrutura[]
}

export interface ChunkEstrutura {
    nome: string
    ordem: number
    caracteres_alvo: number
}

export interface PlanejamentoDB {
    id: string
    projeto_id: string
    titulo: string | null
    tema: string | null
    nicho: string
    tamanho_total: number
    modelo_ia: string
    status: string
    created_at: string
    updated_at: string
}

export interface SecaoDB {
    id: string
    planejamento_id: string
    nome: string
    ordem: number
    porcentagem: number
    caracteres_alvo: number
    objetivo: string | null
    status: string
    created_at: string
    updated_at: string
}

export interface ChunkDB {
    id: string
    secao_id: string
    nome: string
    ordem: number
    caracteres_alvo: number
    conteudo: string | null
    status: string
    tentativas: number
    erro_mensagem: string | null
    created_at: string
    updated_at: string
}

export const NICHOS = {
    MECANICO: 'mecanico',
    MILITAR: 'militar'
} as const

export type NichoType = typeof NICHOS[keyof typeof NICHOS]

export const ESTRUTURAS_NICHOS = {
    [NICHOS.MECANICO]: [
        { nome: "Hook", porcentagem: 10, objetivo: "Prender a atenção do público nos primeiros segundos" },
        { nome: "Introdução", porcentagem: 8, objetivo: "Apresentar o contexto e personagens principais" },
        { nome: "Incidente Incitante", porcentagem: 5, objetivo: "Evento que inicia a jornada do protagonista" },
        { nome: "Desenvolvimento", porcentagem: 42, objetivo: "Desenvolvimento da história com escalada de tensão" },
        { nome: "Clímax", porcentagem: 18, objetivo: "Momento de maior tensão e conflito" },
        { nome: "Resolução", porcentagem: 11, objetivo: "Resolução dos conflitos principais" },
        { nome: "Desfecho", porcentagem: 4, objetivo: "Fechamento da história" },
        { nome: "CTA", porcentagem: 2, objetivo: "Call-to-action para engajamento" }
    ],
    [NICHOS.MILITAR]: [
        { nome: "Hook", porcentagem: 10, objetivo: "Prender a atenção do público nos primeiros segundos" },
        { nome: "Introdução", porcentagem: 8, objetivo: "Apresentar o contexto e personagens principais" },
        { nome: "Incidente Incitante", porcentagem: 5, objetivo: "Evento que inicia a jornada do protagonista" },
        { nome: "Desenvolvimento", porcentagem: 42, objetivo: "Desenvolvimento da história com escalada de tensão" },
        { nome: "Clímax", porcentagem: 18, objetivo: "Momento de maior tensão e conflito" },
        { nome: "Resolução", porcentagem: 11, objetivo: "Resolução dos conflitos principais" },
        { nome: "Desfecho", porcentagem: 4, objetivo: "Fechamento da história" },
        { nome: "CTA", porcentagem: 2, objetivo: "Call-to-action para engajamento" }
    ]
} as const

export const STATUS = {
    PLANEJADO: 'planejado',
    GERANDO: 'gerando',
    CONCLUIDO: 'concluido',
    ERRO: 'erro',
    PENDENTE: 'pendente'
} as const

export type StatusType = typeof STATUS[keyof typeof STATUS]
