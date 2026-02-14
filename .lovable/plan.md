

# Exportar Backup Completo do Sistema

## O que sera feito

Criar uma nova pagina "Exportar Dados" acessivel pela sidebar, que permite exportar em JSON todos os dados do banco de dados e informacoes do sistema para backup antes de remover o banco.

## Dados que serao exportados

### Dados do Banco (Supabase)
1. **monitored_channels** - Todos os canais monitorados (nome, ID, inscritos, views, nicho, notas, tipo de conteudo, datas)
2. **channel_history** - Historico completo de metricas de cada canal (inscritos, views, videos ao longo do tempo)
3. **my_channels** - Seus proprios canais (nome, ID, inscritos, views, idioma, nicho)
4. **video_snapshots** - Snapshots de videos salvos (titulo, views, likes, comentarios)
5. **profiles** - Dados do perfil do usuario

### Dados Locais (localStorage)
6. **Cache de videos recentes** - Videos em cache com thumbnails, metricas e duracao

## Estrutura da Pagina

- Nova rota `/exportar` com link na sidebar
- Botoes individuais para exportar cada tabela separadamente
- Botao "Exportar Tudo" que gera um unico JSON com todas as tabelas
- Indicador de progresso durante a exportacao
- Preview da quantidade de registros em cada tabela antes de exportar

## Detalhes Tecnicos

### Arquivos a criar
1. **`src/pages/Exportar.tsx`** - Pagina principal de exportacao com:
   - Cards mostrando cada tabela e quantidade de registros
   - Botao por tabela para exportar individualmente
   - Botao geral "Exportar Tudo" que baixa um JSON completo
   - Funcao que consulta cada tabela via Supabase client e gera o arquivo JSON para download

2. Atualizacoes nos arquivos existentes:
   - **`src/App.tsx`** - Adicionar rota `/exportar`
   - **`src/components/AppSidebar.tsx`** - Adicionar item "Exportar Dados" no menu com icone `Download`

### Formato do JSON exportado (Exportar Tudo)
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
  }
}
```

### Tratamento de limites
- Supabase retorna no maximo 1000 registros por query. A implementacao fara paginacao automatica para tabelas com mais de 1000 registros (especialmente `channel_history`), garantindo exportacao completa.

