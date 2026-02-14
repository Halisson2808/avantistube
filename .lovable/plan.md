

# Exportar Tudo Separado com Nomes Amigaveis

## O que muda

Em vez de um unico "Exportar Tudo" que gera 1 arquivo gigante, o botao principal vai exportar **todos os arquivos separados de uma vez**, cada um com nome simples e claro. Tambem vamos **remover video_snapshots** da lista.

## Arquivos que serao baixados ao clicar "Exportar Tudo"

| Arquivo | Conteudo |
|---------|----------|
| `Canais-Monitorados.json` | Todos os registros de monitored_channels |
| `Historico-de-Canais.json` | Todos os registros de channel_history |
| `Meus-Canais.json` | Todos os registros de my_channels |
| `Perfil.json` | Dados do profiles |
| `Cache-Videos.json` | Cache do localStorage |
| `Estrutura-Sistema.json` | Schema SQL, RLS, edge functions, config |

## Mudancas

1. **Remover `video_snapshots`** da lista de tabelas (TABLES_CONFIG) - nao sera mais exibido nem exportado
2. **Alterar o botao "Exportar Tudo"** para baixar cada item como arquivo separado com nomes amigaveis (ex: `Canais-Monitorados.json`)
3. **Nomes dos arquivos individuais** tambem serao atualizados para nomes amigaveis em vez de `avantistube_monitored_channels.json`
4. Manter os botoes individuais por tabela para quem quiser exportar apenas um

## Detalhes Tecnicos

### Arquivo modificado: `src/pages/Exportar.tsx`

- Remover `video_snapshots` do array `TABLES_CONFIG`
- Adicionar mapeamento de nomes amigaveis: `monitored_channels` -> `Canais-Monitorados`, `channel_history` -> `Historico-de-Canais`, etc.
- Alterar `exportAll` para fazer download de cada tabela como arquivo separado em sequencia, mais o cache e a estrutura
- Atualizar `exportSingleTable` para usar nomes amigaveis nos arquivos
- Atualizar contadores e textos para refletir a remocao dos snapshots

