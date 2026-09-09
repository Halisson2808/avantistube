import { assertVisualPlan, defineVisualPlan } from '@/components/ebook';

export const visualPlan = assertVisualPlan(defineVisualPlan({
  ebook: 'Nome do ebook',
  maxSameLayoutInSequence: 2,
  pages: [
    {
      page: 1,
      layout: 'chapter-opener',
      image: {
        src: '/imagens/abertura.png',
        shape: 'full-page',
        position: 'background',
        role: 'emotion',
        proportion: 'full-page',
        objectPosition: 'center 35%',
      },
      note: 'Apresenta o tema e muda o ritmo visual.',
    },
    { page: 2, layout: 'text-only', note: 'Página sem imagem para dar contraste e foco.' },
    {
      page: 3,
      layout: 'split-right',
      image: {
        src: '/imagens/demonstracao.png',
        shape: 'portrait',
        position: 'right',
        role: 'explain',
        proportion: '1/2',
        objectPosition: 'center',
      },
    },
  ],
}));
