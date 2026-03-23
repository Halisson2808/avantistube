// Sistema de armazenamento local para históricos e dados

// Roteiros
export interface RoteiroLocal {
    id: string;
    titulo: string;
    nicho: string;
    idioma: string;
    conteudo: string;
    caracteres: number;
    modelo_ia: string;
    created_at: string;
}

const ROTEIROS_KEY = "avantis_roteiros";

export const saveRoteiro = (roteiro: Omit<RoteiroLocal, "id" | "created_at">): RoteiroLocal => {
    const newRoteiro: RoteiroLocal = { ...roteiro, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    const roteiros = getRoteiros();
    roteiros.unshift(newRoteiro);
    if (roteiros.length > 50) roteiros.splice(50);
    localStorage.setItem(ROTEIROS_KEY, JSON.stringify(roteiros));
    return newRoteiro;
};

export const getRoteiros = (): RoteiroLocal[] => {
    const stored = localStorage.getItem(ROTEIROS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const getRoteiro = (id: string): RoteiroLocal | null => getRoteiros().find(r => r.id === id) || null;
export const deleteRoteiro = (id: string): void => {
    localStorage.setItem(ROTEIROS_KEY, JSON.stringify(getRoteiros().filter(r => r.id !== id)));
};

// Títulos
export interface TituloLocal {
    id: string;
    tema: string;
    titulos: string[];
    titulo_selecionado?: string;
    modelo_ia: string;
    created_at: string;
}

const TITULOS_KEY = "avantis_titulos";

export const saveTitulos = (data: Omit<TituloLocal, "id" | "created_at">): TituloLocal => {
    const newTitulo: TituloLocal = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    const titulos = getTitulos();
    titulos.unshift(newTitulo);
    if (titulos.length > 50) titulos.splice(50);
    localStorage.setItem(TITULOS_KEY, JSON.stringify(titulos));
    return newTitulo;
};

export const getTitulos = (): TituloLocal[] => {
    const stored = localStorage.getItem(TITULOS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const deleteTitulo = (id: string): void => {
    localStorage.setItem(TITULOS_KEY, JSON.stringify(getTitulos().filter(t => t.id !== id)));
};

// Transcrições
export interface TranscricaoLocal {
    id: string;
    original_text: string;
    corrected_text?: string;
    translated_text?: string;
    target_language?: string;
    created_at: string;
}

const TRANSCRICOES_KEY = "avantis_transcricoes";

export const saveTranscricao = (data: Omit<TranscricaoLocal, "id" | "created_at">): TranscricaoLocal => {
    const newTranscricao: TranscricaoLocal = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    const transcricoes = getTranscricoes();
    transcricoes.unshift(newTranscricao);
    if (transcricoes.length > 30) transcricoes.splice(30);
    localStorage.setItem(TRANSCRICOES_KEY, JSON.stringify(transcricoes));
    return newTranscricao;
};

export const getTranscricoes = (): TranscricaoLocal[] => {
    const stored = localStorage.getItem(TRANSCRICOES_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const deleteTranscricao = (id: string): void => {
    localStorage.setItem(TRANSCRICOES_KEY, JSON.stringify(getTranscricoes().filter(t => t.id !== id)));
};

// Quadros Brancos
export interface QuadroBrancoLocal {
    id: string;
    titulo?: string;
    nicho?: string;
    descricao?: string;
    resumo?: string;
    outras_informacoes?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

const QUADROS_KEY = "avantis_quadros_brancos";

export const saveQuadroBranco = (data: Omit<QuadroBrancoLocal, "id" | "created_at" | "updated_at">): QuadroBrancoLocal => {
    const newQuadro: QuadroBrancoLocal = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const quadros = getQuadrosBrancos();
    quadros.unshift(newQuadro);
    localStorage.setItem(QUADROS_KEY, JSON.stringify(quadros));
    return newQuadro;
};

export const updateQuadroBranco = (id: string, data: Partial<QuadroBrancoLocal>): void => {
    const quadros = getQuadrosBrancos();
    const index = quadros.findIndex(q => q.id === id);
    if (index !== -1) {
        quadros[index] = { ...quadros[index], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem(QUADROS_KEY, JSON.stringify(quadros));
    }
};

export const getQuadrosBrancos = (): QuadroBrancoLocal[] => {
    const stored = localStorage.getItem(QUADROS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const getQuadroBranco = (id: string): QuadroBrancoLocal | null => getQuadrosBrancos().find(q => q.id === id) || null;
export const deleteQuadroBranco = (id: string): void => {
    localStorage.setItem(QUADROS_KEY, JSON.stringify(getQuadrosBrancos().filter(q => q.id !== id)));
};
