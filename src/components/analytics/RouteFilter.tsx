/**
 * RouteFilter.tsx — recorte por rota dentro de um site.
 *
 * O site é a unidade: um pixel, um painel. Este filtro serve para olhar só
 * algumas páginas dele (`/`, `/sono`, `/obrigado`) sem separar em sites
 * diferentes. Nada selecionado = site inteiro.
 */
import { useState } from "react";
import { Check, ChevronDown, Route, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface RouteOption {
  path: string;
  events: number;
}

export function RouteFilter({
  options,
  selected,
  onChange,
}: {
  options: RouteOption[];
  selected: string[];
  onChange: (paths: string[]) => void;
}) {
  const [aberto, setAberto] = useState(false);

  // Continua visível mesmo sem rota no período: sumir da tela faz parecer que o
  // filtro não existe. Sem opções ele só avisa que não há o que recortar.
  const vazio = options.length === 0;
  const ativo = selected.length > 0;
  const rotulo = !ativo
    ? "Todas as rotas"
    : selected.length === 1
      ? selected[0]
      : `${selected.length} rotas`;

  function alternar(path: string) {
    onChange(
      selected.includes(path)
        ? selected.filter((p) => p !== path)
        : [...selected, path],
    );
  }

  return (
    <div
      className={`flex items-center rounded-lg border transition-colors ${ativo
        ? "bg-emerald-500/10 border-emerald-500/25"
        : "bg-white/[0.04] border-white/[0.08]"
        }`}
    >
      <Popover open={aberto} onOpenChange={setAberto}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors max-w-[220px] ${ativo ? "text-emerald-200" : "text-white/60 hover:text-white"
              }`}
          >
            <Route className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{rotulo}</span>
            <ChevronDown className="h-3 w-3 flex-shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-64 p-0 bg-[rgba(16,16,20,0.98)] border-white/10 text-white"
        >
          <div className="max-h-72 overflow-y-auto py-1">
            {vazio && (
              <p className="px-3 py-4 text-center text-white/35 text-[11px]">
                Nenhuma rota registrada no período.
              </p>
            )}
            {options.map((o) => {
              const marcado = selected.includes(o.path);
              return (
                <button
                  key={o.path}
                  onClick={() => alternar(o.path)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/[0.06] transition-colors"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${marcado
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-white/20"
                      }`}
                  >
                    {marcado && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span className="text-xs text-white truncate flex-1">{o.path}</span>
                  <span className="text-[10px] text-white/30">{o.events}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
            <span className="text-white/35 text-[10px]">
              {ativo ? `${selected.length} selecionada(s)` : "Site inteiro"}
            </span>
            <button
              onClick={() => { onChange([]); setAberto(false); }}
              className="text-white/45 hover:text-white text-[10px] transition-colors"
            >
              Todas
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {ativo && (
        <button
          onClick={() => onChange([])}
          title="Voltar para o site inteiro"
          className="pr-2 pl-0.5 text-emerald-200/60 hover:text-white transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
