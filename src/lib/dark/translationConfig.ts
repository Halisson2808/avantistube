/**
 * Configurações do Sistema de Tradução Otimizado
 */

export interface TranslationConfig {
  // Chunking
  chunk_target_size: number;
  chunk_min_size: number;
  chunk_max_size: number;
  overlap_size: number;
  
  // Delays (em segundos)
  delay_between_chunks: number;
  delay_between_languages: number;
  
  // Contexto
  max_context_sentences: number;
  max_glossary_terms: number;
  
  // API
  model: string;
  temperature: number;
  max_tokens: number;
  
  // Break types (prioridade)
  break_priority: ('paragraph' | 'sentence' | 'any_punct')[];
}

export const TRANSLATION_CONFIG: TranslationConfig = {
  // Chunking
  chunk_target_size: 7000,      // caracteres alvo
  chunk_min_size: 6000,         // mínimo aceitável
  chunk_max_size: 8000,         // máximo aceitável
  overlap_size: 0,              // sem overlap
  
  // Delays
  delay_between_chunks: 0.1,      // segundos (otimizado para velocidade)
  delay_between_languages: 0.2,   // segundos (otimizado para velocidade)
  
  // Contexto
  max_context_sentences: 4,     // frases no contexto
  max_glossary_terms: 15,       // termos no glossário
  
  // API
  model: 'gpt-4o-mini',
  temperature: 0.3,
  max_tokens: 4000,
  
  // Break types (prioridade)
  break_priority: [
    'paragraph',  // \n\n
    'sentence',   // . [A-Z]
    'any_punct',  // .!?
  ]
};

/**
 * Configurações customizáveis por ambiente
 */
export const ENV_CONFIG = {
  development: {
    ...TRANSLATION_CONFIG,
    delay_between_chunks: 0.1,  // Mais rápido em dev
    delay_between_languages: 0.1,
  },
  production: {
    ...TRANSLATION_CONFIG,
  },
  test: {
    ...TRANSLATION_CONFIG,
    delay_between_chunks: 0,
    delay_between_languages: 0,
  }
};

/**
 * Obter configuração baseada no ambiente
 */
export function getConfig(): TranslationConfig {
  const env = import.meta.env.MODE || 'development';
  
  if (env === 'test') return ENV_CONFIG.test;
  if (env === 'production') return ENV_CONFIG.production;
  
  return ENV_CONFIG.development;
}

/**
 * Estimativas baseadas na configuração
 */
export class TranslationEstimator {
  private config: TranslationConfig;

  constructor(config?: TranslationConfig) {
    this.config = config || getConfig();
  }

  /**
   * Estima número de chunks para um texto
   */
  estimateChunks(textLength: number): number {
    return Math.ceil(textLength / this.config.chunk_target_size);
  }

  /**
   * Estima tempo total de tradução
   */
  estimateTime(textLength: number, languageCount: number): {
    chunks: number;
    operations: number;
    estimatedMinutes: number;
    estimatedSeconds: number;
  } {
    const chunks = this.estimateChunks(textLength);
    const operations = chunks * languageCount;
    
    // Tempo por chunk + delays
    const timePerChunk = 3; // segundos médios de processamento
    const delayTime = (chunks - 1) * this.config.delay_between_chunks;
    const languageDelayTime = (languageCount - 1) * this.config.delay_between_languages;
    
    const totalSeconds = (
      operations * timePerChunk +
      delayTime * languageCount +
      languageDelayTime
    );
    
    return {
      chunks,
      operations,
      estimatedMinutes: Math.ceil(totalSeconds / 60),
      estimatedSeconds: totalSeconds
    };
  }

  /**
   * Formata estimativa como texto
   */
  formatEstimate(textLength: number, languageCount: number): string {
    const { chunks, operations, estimatedMinutes } = this.estimateTime(textLength, languageCount);
    
    return `📊 ${languageCount} idiomas × ${chunks} partes (~7k cada) = ${operations} operações\n⏱️ Tempo estimado: ~${estimatedMinutes} minutos`;
  }
}

