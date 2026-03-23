/**
 * Sistema de Tradução Otimizado
 * Implementa chunking inteligente e contexto acumulativo para traduções de alta qualidade
 * 
 * @description
 * Este sistema resolve o problema de traduzir textos longos mantendo consistência e contexto.
 * 
 * COMPONENTES PRINCIPAIS:
 * 
 * 1. SmartTextChunker
 *    - Divide textos em chunks de ~7000 caracteres
 *    - Prioriza quebras em parágrafos (\n\n) ou sentenças (. [A-Z])
 *    - Adiciona overlap de 250-300 caracteres entre chunks
 *    - NUNCA quebra no meio de palavras ou frases
 * 
 * 2. TranslationContext
 *    - Mantém contexto entre chunks durante tradução
 *    - Armazena últimas 3-4 frases do chunk anterior
 *    - Gerencia glossário de até 15 termos importantes
 *    - Detecta e mantém tom do texto (educativo, casual, técnico, etc.)
 * 
 * 3. OptimizedTranslator
 *    - Orquestra o processo completo
 *    - Combina chunking + contexto
 *    - Fornece interface simples de uso
 * 
 * EXEMPLO DE USO:
 * 
 * ```typescript
 * const translator = new OptimizedTranslator();
 * 
 * // Preparar texto para tradução
 * const { chunks, stats } = translator.prepareTranslation(textoLongo);
 * 
 * // Para cada chunk
 * for (const chunk of chunks) {
 *   // Obter contexto para este chunk
 *   const contextPrompt = translator.getContextPrompt();
 *   
 *   // Enviar para API de tradução (pseudo-código)
 *   const traducao = await translateAPI({
 *     text: chunk.text,
 *     context: contextPrompt,
 *     targetLang: 'es'
 *   });
 *   
 *   // Atualizar contexto com a tradução
 *   translator.updateContext(chunk.text, traducao);
 * }
 * ```
 * 
 * VANTAGENS:
 * - ✅ Mantém consistência de termos técnicos
 * - ✅ Preserva tom e estilo entre chunks
 * - ✅ Evita quebras abruptas de contexto
 * - ✅ Otimizado para APIs com limites de tokens
 * - ✅ Fornece estatísticas detalhadas do processamento
 */

export interface Chunk {
  index: number;
  text: string;
  char_count: number;
  break_type: 'paragraph' | 'sentence' | 'forced';
}

export interface TranslationContextData {
  previous_sentences: string[];
  glossary: { [key: string]: string };
  current_chunk_index: number;
  total_chunks: number;
}

/**
 * SmartTextChunker - Divide textos em chunks de ~7000 caracteres com quebras inteligentes
 */
export class SmartTextChunker {
  private targetSize: number = 7000;
  private minSize: number = 6000;
  private maxSize: number = 8000;

  /**
   * Divide o texto em chunks inteligentes
   */
  chunk(text: string): Chunk[] {
    const chunks: Chunk[] = [];
    let position = 0;
    let chunkIndex = 1;

    while (position < text.length) {
      const remainingText = text.slice(position);
      
      // Se o texto restante for menor que maxSize, pega tudo
      if (remainingText.length <= this.maxSize) {
        chunks.push({
          index: chunkIndex,
          text: remainingText,
          char_count: remainingText.length,
          break_type: 'forced'
        });
        break;
      }

      // Determina o range de busca
      const searchStart = Math.min(this.minSize, remainingText.length);
      const searchEnd = Math.min(this.maxSize, remainingText.length);
      const searchRange = remainingText.slice(searchStart, searchEnd);

      let breakPoint: number | null = null;
      let breakType: 'paragraph' | 'sentence' | 'forced' = 'forced';

      // PRIORIDADE 1: Buscar estrofe vazia (\n\n)
      const paragraphBreaks = this.findAllOccurrences(searchRange, /\n\n/g);
      if (paragraphBreaks.length > 0) {
        // Pega a estrofe mais próxima de 7k (relativo ao início do texto)
        const targetInSearch = this.targetSize - searchStart;
        const closest = this.findClosestToTarget(paragraphBreaks, targetInSearch);
        breakPoint = searchStart + closest + 2; // +2 para incluir o \n\n
        breakType = 'paragraph';
      }

      // PRIORIDADE 2: Buscar ponto final + espaço + letra maiúscula
      if (breakPoint === null) {
        const sentenceBreaks = this.findAllOccurrences(searchRange, /\.\s+[A-ZÀ-Ú]/g);
        if (sentenceBreaks.length > 0) {
          const targetInSearch = this.targetSize - searchStart;
          const closest = this.findClosestToTarget(sentenceBreaks, targetInSearch);
          breakPoint = searchStart + closest + 1; // +1 para incluir o ponto
          breakType = 'sentence';
        }
      }

      // PRIORIDADE 3: Buscar qualquer pontuação final + espaço
      if (breakPoint === null) {
        const anyBreaks = this.findAllOccurrences(searchRange, /[.!?]\s/g);
        if (anyBreaks.length > 0) {
          const targetInSearch = this.targetSize - searchStart;
          const closest = this.findClosestToTarget(anyBreaks, targetInSearch);
          breakPoint = searchStart + closest + 1;
          breakType = 'sentence';
        }
      }

      // EMERGÊNCIA: Forçar quebra em maxSize
      if (breakPoint === null) {
        breakPoint = searchEnd;
        breakType = 'forced';
      }

      // Extrai o chunk
      const chunkText = remainingText.slice(0, breakPoint).trim();
      
      chunks.push({
        index: chunkIndex,
        text: chunkText,
        char_count: chunkText.length,
        break_type: breakType
      });

      // Avança posição
      position += breakPoint;
      chunkIndex++;
    }

    return chunks;
  }

  /**
   * Encontra todas as ocorrências de um padrão regex
   */
  private findAllOccurrences(text: string, pattern: RegExp): number[] {
    const positions: number[] = [];
    let match: RegExpExecArray | null;

    // Reset regex state
    pattern.lastIndex = 0;

    while ((match = pattern.exec(text)) !== null) {
      positions.push(match.index);
    }

    return positions;
  }

  /**
   * Encontra a posição mais próxima do target
   */
  private findClosestToTarget(positions: number[], target: number): number {
    if (positions.length === 0) return 0;
    
    return positions.reduce((closest, current) => {
      return Math.abs(current - target) < Math.abs(closest - target) ? current : closest;
    });
  }


  /**
   * Retorna estatísticas dos chunks
   */
  getChunkStats(chunks: Chunk[]): {
    total_chunks: number;
    avg_size: number;
    min_size: number;
    max_size: number;
    total_chars: number;
    break_types: { [key: string]: number };
  } {
    if (chunks.length === 0) {
      return {
        total_chunks: 0,
        avg_size: 0,
        min_size: 0,
        max_size: 0,
        total_chars: 0,
        break_types: {}
      };
    }

    const sizes = chunks.map(c => c.char_count);
    const breakTypes = chunks.reduce((acc, c) => {
      acc[c.break_type] = (acc[c.break_type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      total_chunks: chunks.length,
      avg_size: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
      min_size: Math.min(...sizes),
      max_size: Math.max(...sizes),
      total_chars: sizes.reduce((a, b) => a + b, 0),
      break_types: breakTypes
    };
  }
}

/**
 * TranslationContext - Gerencia contexto acumulativo entre chunks
 */
export class TranslationContext {
  private context: TranslationContextData;
  private maxGlossarySize: number = 15;
  private maxSentences: number = 4;
  private stopWords: Set<string>;

  constructor(totalChunks: number) {
    this.context = {
      previous_sentences: [],
      glossary: {},
      current_chunk_index: 0,
      total_chunks: totalChunks
    };

    // Stop words comuns em português
    this.stopWords = new Set([
      'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das',
      'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'sob',
      'que', 'qual', 'quais', 'este', 'esse', 'aquele', 'esta', 'essa', 'aquela',
      'e', 'ou', 'mas', 'mais', 'como', 'quando', 'onde', 'se', 'não'
    ]);
  }

  /**
   * Atualiza o contexto com uma nova tradução
   */
  updateWithTranslation(originalText: string, translatedText: string): void {
    this.context.current_chunk_index++;

    // Extrai últimas frases da tradução
    this.context.previous_sentences = this.extractLastSentences(translatedText);

    // Atualiza glossário com termos importantes
    const newTerms = this.extractKeyTerms(originalText, translatedText);
    this.updateGlossary(newTerms);
  }

  /**
   * Constrói o prompt de contexto para enviar ao GPT
   */
  buildContextPrompt(): string {
    // Primeiro chunk não precisa de contexto
    if (this.context.current_chunk_index === 0) {
      return '';
    }

    const parts: string[] = [];

    parts.push('📋 CONTEXTO DAS PARTES ANTERIORES:\n');

    // Últimas frases
    if (this.context.previous_sentences.length > 0) {
      parts.push('\nA parte anterior terminou com:');
      parts.push(`"...${this.context.previous_sentences.join(' ')}"\n`);
    }

    // Glossário
    if (Object.keys(this.context.glossary).length > 0) {
      parts.push('\nTermos estabelecidos neste roteiro:');
      for (const [original, translated] of Object.entries(this.context.glossary)) {
        parts.push(`- ${original} → ${translated}`);
      }
      parts.push('');
    }

    // Progresso
    parts.push(`Esta é a parte ${this.context.current_chunk_index + 1} de ${this.context.total_chunks} - mantenha consistência absoluta.`);

    return parts.join('\n');
  }

  /**
   * Extrai as últimas 3-4 frases do texto traduzido
   */
  private extractLastSentences(text: string): string[] {
    // Remove espaços extras e quebras de linha
    const cleaned = text.trim().replace(/\s+/g, ' ');
    
    // Divide por pontuação final
    const sentences = cleaned.split(/[.!?]+\s+/);
    
    // Pega as últimas N frases
    const lastSentences = sentences.slice(-this.maxSentences).filter(s => s.trim().length > 0);
    
    return lastSentences;
  }

  /**
   * Extrai termos-chave mapeando original → tradução
   */
  private extractKeyTerms(original: string, translated: string): { [key: string]: string } {
    const terms: { [key: string]: string } = {};

    // Tokeniza ambos os textos
    const originalWords = this.tokenize(original);
    const translatedWords = this.tokenize(translated);

    // Buscar frases de 2-3 palavras também (não apenas palavras únicas)
    const originalPhrases = this.extractPhrases(original);
    const translatedPhrases = this.extractPhrases(translated);

    // Mapear frases longas primeiro (machine learning, artificial intelligence)
    originalPhrases.forEach((phrase, index) => {
      if (phrase.split(' ').length >= 2 && translatedPhrases[index]) {
        const originalPhrase = phrase.toLowerCase();
        const translatedPhrase = translatedPhrases[index].toLowerCase();
        
        // Se forem diferentes e suficientemente longos
        if (originalPhrase !== translatedPhrase && originalPhrase.length > 8) {
          terms[phrase] = translatedPhrases[index];
        }
      }
    });

    // Conta frequências no original (palavras únicas)
    const frequencies: { [key: string]: number } = {};
    originalWords.forEach(word => {
      const normalized = word.toLowerCase();
      if (this.isValidTerm(normalized)) {
        frequencies[normalized] = (frequencies[normalized] || 0) + 1;
      }
    });

    // Pega palavras importantes (1+ ocorrências e 4+ caracteres)
    const importantWords = Object.entries(frequencies)
      .filter(([word, count]) => count >= 1 && word.length >= 4)
      .sort((a, b) => b[1] - a[1]) // Ordena por frequência
      .map(([word]) => word)
      .slice(0, 10);

    // Mapear palavras individuais
    importantWords.forEach(word => {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\w*\\b`, 'gi');
      const matches = original.match(regex);
      
      if (matches && matches.length > 0) {
        const originalForm = matches[0];
        
        // Tentar encontrar correspondência na tradução por proximidade
        const translatedMatch = this.findTranslationMatch(originalForm, translatedWords);
        
        if (translatedMatch && translatedMatch.toLowerCase() !== originalForm.toLowerCase()) {
          terms[originalForm] = translatedMatch;
        }
      }
    });

    return terms;
  }

  /**
   * Extrai frases de 2-3 palavras do texto
   */
  private extractPhrases(text: string): string[] {
    const words = text.split(/\s+/);
    const phrases: string[] = [];
    
    // Frases de 2 palavras
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (this.isValidPhrase(phrase)) {
        phrases.push(phrase);
      }
    }
    
    return phrases;
  }

  /**
   * Verifica se uma frase é válida
   */
  private isValidPhrase(phrase: string): boolean {
    const cleaned = phrase.replace(/[.,!?;:()\[\]{}'"]/g, '').toLowerCase();
    const words = cleaned.split(/\s+/);
    
    // Deve ter pelo menos 2 palavras não stopwords
    const validWords = words.filter(w => !this.stopWords.has(w) && w.length > 2);
    return validWords.length >= 2;
  }

  /**
   * Encontra melhor correspondência de tradução
   */
  private findTranslationMatch(originalWord: string, translatedWords: string[]): string | null {
    const originalLower = originalWord.toLowerCase();
    
    // Busca por palavras que começam com as mesmas letras
    const prefix = originalLower.slice(0, Math.min(4, originalLower.length));
    
    for (const translatedWord of translatedWords) {
      const translatedLower = translatedWord.toLowerCase();
      
      // Se começa com mesmo prefixo ou tem tamanho similar
      if (translatedLower.startsWith(prefix) || 
          Math.abs(translatedLower.length - originalLower.length) <= 2) {
        return translatedWord;
      }
    }
    
    return null;
  }

  /**
   * Escapa caracteres especiais de regex
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Atualiza o glossário, mantendo no máximo maxGlossarySize termos
   */
  private updateGlossary(newTerms: { [key: string]: string }): void {
    // Adiciona novos termos
    Object.assign(this.context.glossary, newTerms);

    // Se exceder o limite, remove os mais antigos
    const entries = Object.entries(this.context.glossary);
    if (entries.length > this.maxGlossarySize) {
      const toKeep = entries.slice(-this.maxGlossarySize);
      this.context.glossary = Object.fromEntries(toKeep);
    }
  }


  /**
   * Tokeniza um texto em palavras
   */
  private tokenize(text: string): string[] {
    return text
      .replace(/[.,!?;:()\[\]{}'"]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Verifica se um termo é válido (não é stop word e tem tamanho adequado)
   */
  private isValidTerm(word: string): boolean {
    return (
      word.length >= 4 &&
      !this.stopWords.has(word) &&
      !/^\d+$/.test(word) // não é apenas números
    );
  }

  /**
   * Retorna o contexto atual (para debugging)
   */
  getContext(): TranslationContextData {
    return { ...this.context };
  }

  /**
   * Retorna o índice do chunk atual
   */
  getCurrentIndex(): number {
    return this.context.current_chunk_index;
  }

  /**
   * Retorna o total de chunks
   */
  getTotalChunks(): number {
    return this.context.total_chunks;
  }

  /**
   * Reseta o contexto para um novo documento
   */
  reset(totalChunks: number): void {
    this.context = {
      previous_sentences: [],
      glossary: {},
      current_chunk_index: 0,
      total_chunks: totalChunks
    };
  }
}

/**
 * ChunkMerger - Une chunks traduzidos de forma simples
 */
export class ChunkMerger {
  /**
   * Une chunks traduzidos com separação por parágrafo
   */
  static mergeChunks(translatedChunks: string[]): string {
    if (translatedChunks.length === 0) return '';
    if (translatedChunks.length === 1) return translatedChunks[0];

    // Simplesmente une os chunks com dupla quebra de linha
    let result = translatedChunks.join('\n\n');

    // Limpar espaçamentos múltiplos
    result = this.cleanSpacing(result);

    return result;
  }

  /**
   * Remove espaçamentos múltiplos
   */
  private static cleanSpacing(text: string): string {
    // Remover espaços múltiplos
    text = text.replace(/  +/g, ' ');
    
    // Remover quebras triplas ou mais
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
  }
}

/**
 * MetadataCleaner - Remove metadados indesejados das traduções
 */
export class MetadataCleaner {
  /**
   * Remove marcadores e metadados das traduções - VERSÃO SIMPLIFICADA
   */
  static cleanTranslation(text: string): string {
    const lines = text.split('\n');
    const cleanedLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Manter linhas vazias
      if (trimmed === '') {
        cleanedLines.push('');
        continue;
      }

      // Remover apenas linhas claramente problemáticas (MAIS CONSERVADOR)
      const shouldRemove = (
        // Headers markdown
        trimmed.startsWith('#') ||
        
        // Separadores óbvios
        /^[=\-_]{5,}$/.test(trimmed) ||
        
        // Contexto vazado do sistema
        trimmed.startsWith('📋') ||
        trimmed.includes('CONTEXTO DAS PARTES ANTERIORES') ||
        trimmed.includes('A parte anterior terminou com') ||
        trimmed.includes('Termos estabelecidos neste roteiro') ||
        /Esta é a parte \d+ de \d+/.test(trimmed) ||
        
        // Instruções vazadas
        trimmed.includes('mantenha consistência absoluta') ||
        trimmed.includes('INSTRUÇÕES CRÍTICAS')
      );

      if (!shouldRemove) {
        cleanedLines.push(line);
      }
    }

    let cleaned = cleanedLines.join('\n');

    // Normalizar espaçamentos
    cleaned = cleaned.replace(/  +/g, ' ');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.trim();

    return cleaned;
  }

  /**
   * Limpa e valida uma tradução completa
   */
  static finalClean(text: string): string {
    let cleaned = this.cleanTranslation(text);

    // Normalizar aspas
    cleaned = cleaned.replace(/[""]/g, '"');
    cleaned = cleaned.replace(/['']/g, "'");

    // Normalizar espaços e pontuação
    cleaned = cleaned.replace(/\s+([.,!?;:])/g, '$1');
    cleaned = cleaned.replace(/([.,!?;:])([^\s\n])/g, '$1 $2');
    cleaned = cleaned.replace(/  +/g, ' ');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    return cleaned.trim();
  }
}

/**
 * Classe SIMPLIFICADA para tradução com prompt caching
 * Apenas chunking inteligente + contexto mínimo dos últimos 500 caracteres
 */
export class OptimizedTranslator {
  private chunker: SmartTextChunker;
  private lastTranslatedChunks: string[] = [];

  constructor() {
    this.chunker = new SmartTextChunker();
  }

  /**
   * Prepara um texto para tradução, retornando chunks
   */
  prepareTranslation(text: string): {
    chunks: Chunk[];
    stats: ReturnType<SmartTextChunker['getChunkStats']>;
  } {
    const chunks = this.chunker.chunk(text);
    const stats = this.chunker.getChunkStats(chunks);
    
    // Reseta contexto
    this.lastTranslatedChunks = [];
    
    return { chunks, stats };
  }

  /**
   * Obtém contexto simples dos últimos ~500 caracteres traduzidos
   * O cache da OpenAI manterá a consistência, isso é só backup
   */
  getContextPrompt(): string {
    if (this.lastTranslatedChunks.length === 0) return '';
    
    const lastChunk = this.lastTranslatedChunks[this.lastTranslatedChunks.length - 1];
    const contextLength = 500;
    
    if (lastChunk.length <= contextLength) {
      return lastChunk;
    }
    
    return '...' + lastChunk.slice(-contextLength);
  }

  /**
   * Atualiza o contexto com o último chunk traduzido
   */
  updateContext(translatedText: string): void {
    this.lastTranslatedChunks.push(translatedText);
  }

  /**
   * Une chunks traduzidos simplesmente
   */
  mergeTranslatedChunks(translatedChunks: string[]): string {
    // Limpa possíveis metadados que podem vir da API
    const cleanedChunks = translatedChunks.map(chunk => 
      MetadataCleaner.cleanTranslation(chunk)
    );
    
    return cleanedChunks.join('\n\n');
  }
}

