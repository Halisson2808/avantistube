# Sistema editorial A4

## Fluxo para um novo ebook

1. Crie o plano visual ao lado do arquivo do ebook, usando `VISUAL-PLAN.template.ts` como ponto de partida.
2. Dê a cada imagem uma função narrativa: contextualizar, explicar, emocionar, provar, transicionar ou criar respiro.
3. Rode `validateVisualPlan`/`assertVisualPlan` antes de montar as páginas. A validação impede página duplicada, imagem sem intenção declarada e mais de duas composições iguais em sequência.
4. Monte as páginas importando os layouts de `@/components/ebook`.
5. Confira os avisos vermelhos em desenvolvimento e faça uma impressão de teste em A4, escala 100%, sem margens do navegador.

## Escolha do layout

| Necessidade editorial | Componente |
|---|---|
| Texto principal com retrato de apoio | `TextPortraitPage` |
| Imagem e texto com pesos equivalentes | `SplitEditorialPage` |
| Contexto visual antes ou depois da leitura | `HeroEditorialPage` |
| Pequeno acento visual sem interromper o texto | `FloatingImagePage` |
| Imagem entre dois blocos narrativos | `InlineImagePage` |
| Citação, alerta ou insight imersivo | `BackgroundInsightPage` |
| Início forte de capítulo | `ChapterOpenerPage` |
| Checklist, passos, comparação ou cards | `IllustratedContentPage` |
| Pausa ou transição visual | `VisualBreatherPage` |
| Leitura concentrada, sem imagem | `PdfContentPage` |

## Arquitetura

```text
Plano visual tipado
        |
        v
Validação de ritmo e intenção
        |
        v
Layouts editoriais reutilizáveis
        |
        v
Página A4 + área segura + detector de corte
        |
        v
Impressão do navegador / PDF
```

Os layouts usam alturas em milímetros, áreas internas fixas e imagens com `object-fit: cover` ou `contain`. Isso reduz CSS improvisado, mas não substitui a revisão visual: quantidade de texto, foco fotográfico e carregamento de fontes ainda podem mudar o equilíbrio de uma página.

## Decisões e limites

- O plano fica em TypeScript para acompanhar o código e falhar cedo; se no futuro houver um editor visual, ele pode ser serializado para JSON.
- O limite padrão é duas composições idênticas em sequência. É simples e previsível; métricas mais sofisticadas de ritmo podem ser adicionadas quando houver muitos ebooks planejados.
- O detector é uma proteção de desenvolvimento. A verificação final continua sendo a exportação real, pois motores de impressão podem variar na rasterização de fontes e imagens.
- Capas permanecem PNGs completos. Os layouts deste catálogo são destinados ao miolo.
