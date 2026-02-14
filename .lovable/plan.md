

# Backup Completo com Schema e Codigo do Sistema

## Situacao Atual

A pagina de exportacao atual exporta **apenas os dados (registros)** das tabelas. Para recriar o sistema do zero, faltam:

- Schema SQL (CREATE TABLE, tipos, triggers, funcoes)
- Politicas RLS (Row Level Security)
- Codigo das Edge Functions
- Migrations existentes

## O que sera adicionado

Uma nova secao **"Estrutura do Sistema"** na pagina `/exportar` que inclui no JSON exportado:

### 1. Schema do Banco de Dados
Sera embutido diretamente no codigo como um objeto JSON contendo:
- Definicao de todas as 5 tabelas (colunas, tipos, defaults, nullable)
- Tipo customizado `content_type_enum` (longform, shorts, etc.)
- Todas as politicas RLS de cada tabela
- Funcoes do banco (`handle_new_user`, `handle_updated_at`, `update_monitored_channels_last_updated`)
- Triggers associados

### 2. Codigo das Edge Functions
Os 3 edge functions serao incluidos como texto no JSON:
- `add-channel` - Adicionar canal ao monitoramento
- `youtube` - Busca, detalhes e videos do YouTube
- `update-all-channels` - Atualizacao em lote de todos os canais

### 3. Configuracoes
- Lista de secrets necessarios (nomes, sem valores)
- URL e chave do Supabase (anonima)

## Como funciona

O botao **"Exportar Backup Completo"** ja existente passara a incluir tudo isso automaticamente. Alem disso, havera um novo card **"Estrutura do Sistema"** com botao separado para exportar apenas o schema + edge functions sem os dados.

## Formato do JSON completo atualizado

```text
{
  "exportedAt": "2026-02-14T...",
  "system": "AvantisTube",
  "data": {
    "monitored_channels": [...],
    "channel_history": [...],
    "my_channels": [...],
    "video_snapshots": [...],
    "profiles": [...],
    "localStorage_cache": {...}
  },
  "schema": {
    "tables": {
      "monitored_channels": { columns: [...], rls_policies: [...] },
      ...
    },
    "enums": ["content_type_enum"],
    "functions": [...],
    "triggers": [...]
  },
  "edge_functions": {
    "add-channel": "// codigo completo...",
    "youtube": "// codigo completo...",
    "update-all-channels": "// codigo completo..."
  },
  "config": {
    "required_secrets": ["VITE_YOUTUBE_API_KEY", "SUPABASE_SERVICE_ROLE_KEY", ...],
    "supabase_url": "...",
    "supabase_anon_key": "..."
  }
}
```

## Detalhes Tecnicos

### Arquivo modificado
- **`src/pages/Exportar.tsx`** - Adicionar:
  - Constante `SYSTEM_SCHEMA` com toda a definicao do banco (tabelas, colunas, tipos, RLS, funcoes, triggers) hardcoded como objeto JS
  - Constante `EDGE_FUNCTIONS_CODE` com o codigo fonte das 3 edge functions como strings
  - Constante `SYSTEM_CONFIG` com nomes dos secrets e configuracoes
  - Novo card "Estrutura do Sistema" com botao de exportar separado
  - Incluir tudo isso no "Exportar Backup Completo"

### Por que hardcoded?
O Supabase client nao permite consultar `information_schema` nem ler arquivos do servidor pelo frontend. Entao o schema e o codigo das edge functions serao embutidos diretamente no componente. Isso garante que o backup tenha tudo necessario para reconstruir o sistema.

