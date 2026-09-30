# Feed YouTube

O Feed, o Monitoramento e Meus Canais usam a tabela existente channel_video_cache. Abrir o feed, trocar o formato, incluir canais próprios ou recarregar lê o banco, sem atualizar o YouTube automaticamente. Não há identificação automática do formato dos vídeos: Shorts/Longos seguem content_type do cadastro.

O botão do Feed atualiza todos os canais cadastrados, inclusive próprios e canais do outro formato. O Monitoramento e Meus Canais mantêm seus botões de atualização por canal, nicho ou lista. Todos usam a mesma captura paginada dos últimos 30 dias e salvam a lista completa no banco, sem o antigo limite de sete vídeos. A consulta de status anterior é mantida para canais sem publicações no período.

A gravação é aguardada antes de confirmar sucesso. Falhas não substituem o banco por uma lista parcial. As telas releem o banco ao receber uma notificação de gravação ou ao voltar ao foco; essas leituras não usam a API do YouTube. Nenhuma migração é necessária. Os registros antigos continuam disponíveis e serão ampliados quando o usuário solicitar uma atualização.

As fileiras Hoje, Últimos 7 dias e restante dos Últimos 30 dias continuam ordenadas por views, sem repetir vídeos. Links de canal e vídeo, horário exato, scroll escuro e inclusão opcional dos canais próprios permanecem.

Proteção de cota: as consultas /api/youtube/* não repetem automaticamente erros de rede ou servidor. A atualização por lotes para quando recebe quotaExceeded. O servidor bloqueia novas consultas após detectar o esgotamento, até a mudança do dia da cota; o bloqueio fica na memória de cada processo. Cadastrar canais não inicia uma captura adicional de vídeos em segundo plano. Resolver o canal e obter seus dados básicos durante o cadastro ainda são consultas necessárias à ação de cadastrar. Testes offline: node scripts/verify-youtube-quota.mjs.
