/**
 * DateRangePicker.tsx — escolha do período por calendário.
 *
 * Substitui os dois <input type="date"> nativos: abre um calendário de dois
 * meses, seleciona o intervalo clicando no primeiro e no último dia, e devolve
 * as datas no formato AAAA-MM-DD que a API espera.
 */
import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange as DayPickerRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** "2026-09-09" → Date (meio-dia, para não escorregar de fuso). */
function paraData(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return isNaN(d.getTime()) ? undefined : d;
}

const paraIso = (d?: Date) => (d ? format(d, "yyyy-MM-dd") : "");
const curto = (d: Date) => format(d, "d MMM", { locale: ptBR });

export function DateRangePicker({
  from,
  to,
  onChange,
}: {
  from?: string;
  to?: string;
  onChange: (from: string, to: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const selecionado: DayPickerRange | undefined = from
    ? { from: paraData(from), to: paraData(to) }
    : undefined;

  const ativo = Boolean(from && to);
  const rotulo = ativo
    ? `${curto(paraData(from)!)} – ${curto(paraData(to)!)}`
    : "Datas";

  function aoSelecionar(range: DayPickerRange | undefined) {
    const inicio = paraIso(range?.from);
    const fim = paraIso(range?.to);
    onChange(inicio, fim);
    // Fecha só quando o intervalo está completo.
    if (inicio && fim) setAberto(false);
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors ${ativo ? "text-emerald-200" : "text-white/60 hover:text-white"
              }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {rotulo}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-0 bg-[#101014] border-white/10 text-white"
        >
          <Calendar
            mode="range"
            locale={ptBR}
            numberOfMonths={2}
            defaultMonth={paraData(from)}
            selected={selecionado}
            onSelect={aoSelecionar}
            disabled={{ after: new Date() }}
            className="text-white"
            // O tema do painel é vermelho; aqui o módulo é verde, então o
            // intervalo selecionado segue a cor de Sites & Tráfego.
            classNames={{
              head_cell: "text-white/35 rounded-md w-9 font-normal text-[0.8rem]",
              day: "h-9 w-9 p-0 font-normal text-white/80 hover:bg-white/10 rounded-md aria-selected:opacity-100",
              day_selected:
                "bg-emerald-500 text-white hover:bg-emerald-500 focus:bg-emerald-500",
              day_range_middle: "bg-emerald-500/20 text-white rounded-none",
              day_range_start: "rounded-l-md",
              day_range_end: "rounded-r-md",
              day_today: "ring-1 ring-emerald-400/50",
              day_outside: "text-white/20",
              day_disabled: "text-white/15 hover:bg-transparent",
              caption_label: "text-sm font-medium text-white",
              nav_button: "h-7 w-7 bg-transparent p-0 text-white/60 hover:text-white opacity-70 hover:opacity-100",
            }}
          />
          <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
            <span className="text-white/35 text-[10px]">
              Clique no primeiro e no último dia
            </span>
            <button
              onClick={() => { onChange("", ""); setAberto(false); }}
              className="text-white/45 hover:text-white text-[10px] transition-colors"
            >
              Limpar
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {ativo && (
        <button
          onClick={() => onChange("", "")}
          title="Voltar para os períodos rápidos"
          className="pr-2 pl-0.5 text-emerald-200/60 hover:text-white transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
