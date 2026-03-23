/**
 * Sistema de Logging para Tradução Otimizada
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SUCCESS = 'success'
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
}

export class TranslationLogger {
  private logs: LogEntry[] = [];
  private enabled: boolean = true;
  private onLogCallback?: (entry: LogEntry) => void;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  /**
   * Define callback para ser chamado quando há novo log
   */
  setOnLog(callback: (entry: LogEntry) => void): void {
    this.onLogCallback = callback;
  }

  /**
   * Log genérico
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    };

    this.logs.push(entry);

    // Emitir para callback se definido
    if (this.onLogCallback) {
      this.onLogCallback(entry);
    }

    // Console output com estilo
    const emoji = this.getEmoji(level);
    const style = this.getStyle(level);
    
    if (data) {
      console.log(`%c${emoji} ${message}`, style, data);
    } else {
      console.log(`%c${emoji} ${message}`, style);
    }
  }

  /**
   * Obtém emoji para o nível de log
   */
  private getEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
      case LogLevel.SUCCESS: return '✅';
      default: return '📝';
    }
  }

  /**
   * Obtém estilo CSS para o console
   */
  private getStyle(level: LogLevel): string {
    const baseStyle = 'padding: 2px 4px; border-radius: 2px;';
    
    switch (level) {
      case LogLevel.DEBUG:
        return `${baseStyle} color: #666; background: #f0f0f0;`;
      case LogLevel.INFO:
        return `${baseStyle} color: #0066cc; background: #e6f2ff;`;
      case LogLevel.WARN:
        return `${baseStyle} color: #cc6600; background: #fff3e6;`;
      case LogLevel.ERROR:
        return `${baseStyle} color: #cc0000; background: #ffe6e6;`;
      case LogLevel.SUCCESS:
        return `${baseStyle} color: #00aa00; background: #e6ffe6;`;
      default:
        return baseStyle;
    }
  }

  // Métodos de conveniência
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  success(message: string, data?: any): void {
    this.log(LogLevel.SUCCESS, message, data);
  }

  /**
   * Logs específicos do processo de tradução
   */

  logTextInfo(textLength: number): void {
    this.info(`📝 Texto original: ${textLength.toLocaleString()} caracteres`);
  }

  logChunkingComplete(chunks: any[]): void {
    this.info(`✂️ Dividido em ${chunks.length} chunks:`);
    chunks.forEach(chunk => {
      this.debug(`  - Chunk ${chunk.index}: ${chunk.char_count} chars (break: ${chunk.break_type})`);
    });
  }

  logChunkStart(language: string, chunkIdx: number, totalChunks: number): void {
    this.info(`🌐 ${language} - Chunk ${chunkIdx}/${totalChunks}: Iniciando...`);
  }

  logChunkComplete(language: string, chunkIdx: number, totalChunks: number, translatedLength: number): void {
    this.info(`🌐 ${language} - Chunk ${chunkIdx}/${totalChunks}: Traduzido (${translatedLength} chars)`);
  }

  logDelay(seconds: number, reason: string): void {
    this.debug(`⏳ Aguardando ${seconds}s (${reason})...`);
  }

  logMergeComplete(language: string, mergedLength: number): void {
    this.info(`🔗 ${language} - União completa: ${mergedLength.toLocaleString()} chars`);
  }

  logCleaningComplete(language: string, finalLength: number): void {
    this.info(`🧹 ${language} - Limpeza: texto final com ${finalLength.toLocaleString()} chars`);
  }

  logLanguageComplete(language: string): void {
    this.success(`✅ ${language}: COMPLETO!`);
  }

  logTranslationStart(languages: string[], textLength: number): void {
    this.info(`🚀 Iniciando tradução otimizada`);
    this.info(`   Idiomas: ${languages.join(', ')}`);
    this.info(`   Texto: ${textLength.toLocaleString()} caracteres`);
  }

  logTranslationComplete(totalTime: number): void {
    this.success(`🎉 Tradução completa em ${totalTime.toFixed(1)}s!`);
  }

  logError(context: string, error: any): void {
    this.error(`❌ Erro em ${context}:`, error);
  }

  logContextInfo(contextData: any): void {
    this.debug(`📋 Contexto atual:`, {
      tom: contextData.detected_tone,
      glossario: Object.keys(contextData.glossary).length,
      frases: contextData.previous_sentences.length
    });
  }

  /**
   * Obtém todos os logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Obtém logs filtrados por nível
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Limpa todos os logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Exporta logs como texto
   */
  exportAsText(): string {
    return this.logs.map(log => {
      const time = log.timestamp.toLocaleTimeString();
      const level = log.level.toUpperCase().padEnd(7);
      let line = `[${time}] ${level} ${log.message}`;
      
      if (log.data) {
        line += `\n  Data: ${JSON.stringify(log.data, null, 2)}`;
      }
      
      return line;
    }).join('\n\n');
  }

  /**
   * Exporta logs como JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Gera relatório resumido
   */
  generateReport(): string {
    const errors = this.getLogsByLevel(LogLevel.ERROR).length;
    const warnings = this.getLogsByLevel(LogLevel.WARN).length;
    const successes = this.getLogsByLevel(LogLevel.SUCCESS).length;
    
    return `
📊 RELATÓRIO DE TRADUÇÃO

Total de logs: ${this.logs.length}
✅ Sucessos: ${successes}
⚠️  Avisos: ${warnings}
❌ Erros: ${errors}

Primeira entrada: ${this.logs[0]?.timestamp.toLocaleString()}
Última entrada: ${this.logs[this.logs.length - 1]?.timestamp.toLocaleString()}
    `.trim();
  }

  /**
   * Habilitar/desabilitar logs
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

/**
 * Instância global do logger
 */
export const translationLogger = new TranslationLogger(true);

