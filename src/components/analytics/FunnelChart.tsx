/**
 * FunnelChart.tsx — o funil desenhado, do jeito que se lê de relance:
 * uma faixa que vai estreitando de etapa em etapa.
 *
 * A altura de cada etapa é proporcional às sessões da primeira, então o
 * estreitamento é a própria taxa de conversão. Etapas minúsculas ganham uma
 * altura mínima só para continuarem visíveis — o número exato fica no rótulo,
 * nunca no desenho.
 */
import type { FunnelStep } from "@/hooks/use-analytics";

const W = 1000;   // largura do viewBox (o SVG escala sozinho)
const H = 260;    // altura útil da faixa
const MIN_H = 5;  // sliver mínimo para uma etapa quase zerada não sumir

const fmt = (n: number) => (n ?? 0).toLocaleString("pt-BR");

/**
 * Percentual em português. Uma etapa com pouquíssimas sessões não pode virar
 * "0%" — isso faria parecer que ninguém converteu quando alguém converteu.
 */
function pct(razao: number): string {
  const v = razao * 100;
  if (v === 0) return "0%";
  if (v < 0.1) return "<0,1%";
  return `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

export function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  if (steps.length < 2) return null;

  const topo = steps[0]?.sessions || 0;
  const col = W / steps.length;
  const meio = H / 2;

  // Centro de cada coluna e a meia-altura da faixa ali.
  const pontos = steps.map((s, i) => {
    const razao = topo ? s.sessions / topo : 0;
    const altura = Math.max(razao * H, s.sessions > 0 ? MIN_H : 2);
    return { x: col * i + col / 2, meiaAltura: altura / 2, razao, step: s };
  });

  // Uma borda: reta da margem até o primeiro centro, curva em S entre os
  // centros, reta até a outra margem. `sinal` escolhe topo (-1) ou base (+1).
  const y = (p: typeof pontos[number], sinal: 1 | -1) => meio + sinal * p.meiaAltura;

  function curvas(seq: typeof pontos, sinal: 1 | -1) {
    let d = "";
    for (let i = 1; i < seq.length; i++) {
      const a = seq[i - 1];
      const b = seq[i];
      const cx = (a.x + b.x) / 2;
      d += ` C ${cx} ${y(a, sinal)}, ${cx} ${y(b, sinal)}, ${b.x} ${y(b, sinal)}`;
    }
    return d;
  }

  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];

  const caminho = [
    `M 0 ${y(primeiro, -1)}`,
    `L ${primeiro.x} ${y(primeiro, -1)}`,
    curvas(pontos, -1),
    `L ${W} ${y(ultimo, -1)}`,
    `L ${W} ${y(ultimo, 1)}`,
    `L ${ultimo.x} ${y(ultimo, 1)}`,
    curvas([...pontos].reverse(), 1),
    `L 0 ${y(primeiro, 1)}`,
    "Z",
  ].join(" ");

  return (
    <div className="space-y-2">
      {/* Rótulos das etapas */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((s, i) => (
          <div key={`${s.eventName}-${i}`} className="px-2 text-center">
            <p className="text-white text-[11px] font-medium truncate">{s.label}</p>
            <code className="text-white/25 text-[9px] truncate block">{s.eventName}</code>
          </div>
        ))}
      </div>

      {/* Faixa */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="funilGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <path d={caminho} fill="url(#funilGrad)" />

          {/* Divisórias entre as etapas */}
          {steps.slice(1).map((_, i) => (
            <line
              key={i}
              x1={col * (i + 1)}
              x2={col * (i + 1)}
              y1={0}
              y2={H}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          ))}
        </svg>

        {/* Percentuais sobre a faixa */}
        <div
          className="absolute inset-0 grid items-center pointer-events-none"
          style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
        >
          {pontos.map((p, i) => (
            <div key={i} className="text-center">
              <span
                className="text-white font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]"
                style={{ fontSize: p.razao > 0.25 ? 20 : 15 }}
              >
                {pct(p.razao)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Números embaixo */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((s, i) => {
          const anterior = i > 0 ? steps[i - 1].sessions : s.sessions;
          const daEtapaAnterior = anterior ? (s.sessions / anterior) * 100 : 0;
          return (
            <div key={`${s.eventName}-n-${i}`} className="px-2 text-center">
              <p className="text-white text-sm font-semibold">{fmt(s.sessions)}</p>
              <p className="text-white/30 text-[10px]">
                {i === 0 ? "sessões" : `${pct(daEtapaAnterior / 100)} da anterior`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
