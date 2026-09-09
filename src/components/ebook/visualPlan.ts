export const editorialLayoutKinds = [
  'text-portrait',
  'split-left',
  'split-right',
  'hero-top-medium',
  'hero-top-large',
  'hero-bottom',
  'floating-image',
  'inline-image',
  'background-insight',
  'chapter-opener',
  'illustrated-content',
  'visual-breather',
  'text-only',
] as const;

export type EditorialLayoutKind = (typeof editorialLayoutKinds)[number];
export type ImageShape = 'landscape' | 'portrait' | 'square' | 'full-page' | 'none';
export type NarrativeRole = 'context' | 'explain' | 'emotion' | 'proof' | 'transition' | 'rest' | 'none';

export interface VisualPlanPage {
  page: number;
  layout: EditorialLayoutKind;
  image?: {
    src?: string;
    shape: Exclude<ImageShape, 'none'>;
    position: string;
    role: Exclude<NarrativeRole, 'none'>;
    proportion?: string;
    objectPosition?: string;
  };
  note?: string;
}

export interface VisualPlan {
  ebook: string;
  pages: VisualPlanPage[];
  maxSameLayoutInSequence?: number;
}

export interface VisualPlanIssue {
  page: number;
  message: string;
}

export function defineVisualPlan(plan: VisualPlan): VisualPlan {
  return plan;
}

export function validateVisualPlan(plan: VisualPlan): VisualPlanIssue[] {
  const issues: VisualPlanIssue[] = [];
  const maxSequence = plan.maxSameLayoutInSequence ?? 2;
  const seen = new Set<number>();
  let previous: EditorialLayoutKind | undefined;
  let sequence = 0;

  for (const item of plan.pages) {
    if (seen.has(item.page)) issues.push({ page: item.page, message: 'Número de página duplicado.' });
    seen.add(item.page);
    sequence = item.layout === previous ? sequence + 1 : 1;
    previous = item.layout;
    if (sequence > maxSequence) {
      issues.push({ page: item.page, message: `Layout “${item.layout}” repetido ${sequence} vezes em sequência.` });
    }
    const needsImage = item.layout !== 'text-only';
    if (needsImage && !item.image) {
      issues.push({ page: item.page, message: `O layout “${item.layout}” precisa declarar a função e o formato da imagem.` });
    }
  }
  return issues;
}

export function assertVisualPlan(plan: VisualPlan): VisualPlan {
  const issues = validateVisualPlan(plan);
  if (issues.length) {
    throw new Error(`Plano visual inválido:\n${issues.map((issue) => `Página ${issue.page}: ${issue.message}`).join('\n')}`);
  }
  return plan;
}
