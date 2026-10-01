/** Read the complete period, including when PostgREST caps each response. */
export async function fetchTrackingEvents(db, { siteKey, range, paths, ascending = true }) {
  const rows = [];
  for (;;) {
    let query = db.from("tracking_events").select("*", { count: "exact" })
      .gte("created_at", range.fromIso).lte("created_at", range.toIso)
      .order("created_at", { ascending }).order("id", { ascending })
      .range(rows.length, rows.length + 999);
    if (siteKey) query = query.eq("site_key", siteKey);
    if (paths) query = query.in("path", paths);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    if (!data?.length) {
      if (count != null && rows.length < count) throw new Error("Leitura incompleta dos eventos. Atualize o painel.");
      break;
    }
    rows.push(...data);
    if (count != null && rows.length >= count) break;
  }
  return rows;
}

/** Closed funnel: each stage requires the previous stages in the same session.
 * Beacon arrival order is not interaction order; historical rows have only received timestamps.
 */
export function buildSequentialFunnel(rows, steps) {
  const sessions = new Map();
  for (const row of rows) {
    const key = JSON.stringify([row.site_key, row.session_id || row.visitor_id || row.id]);
    if (!sessions.has(key)) sessions.set(key, []);
    sessions.get(key).push(row);
  }
  const result = steps.map(step => ({
    label: step.label, eventName: step.event_name, events: 0, sessions: 0, value: 0,
    dropped: 0, completionRate: 0,
  }));
  for (const events of sessions.values()) {
    events.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
    const used = new Set();
    for (let next = 0; next < steps.length; next++) {
      const step = steps[next];
      const question = step.event_name.match(/^quiz_question_answered:(\d+)$/);
      const event = events.find(event => !used.has(event.id) && (question
        ? event.event_name === "quiz_question_answered" && Number(event.meta?.step) === Number(question[1])
        : step.event_name.startsWith("path:")
          ? event.event_type === "pageview" && (event.path || "/") === step.event_name.slice(5)
          : event.event_name === step.event_name || event.event_type === step.event_name));
      if (!event) break;
      used.add(event.id);
      result[next].sessions++;
      result[next].events++;
      result[next].value += Number(event.value) || 0;
    }
  }
  for (let i = 0; i < result.length; i++) {
    result[i].dropped = i + 1 < result.length ? result[i].sessions - result[i + 1].sessions : 0;
    result[i].completionRate = result[0].sessions ? result[i].sessions / result[0].sessions : 0;
  }
  return result;
}

/** Existing quiz events already contain the question number; no new pixel required. */
export function quizFunnelSteps(rows) {
  const questions = [...new Set(rows
    .filter(row => row.event_name === "quiz_question_answered")
    .map(row => Number(row.meta?.step))
    .filter(step => Number.isInteger(step) && step > 0 && step <= 100))].sort((a, b) => a - b);
  return [
    { label: "Iniciou o quiz", event_name: "quiz_started" },
    ...questions.map(step => ({ label: `Respondeu pergunta ${step}`, event_name: `quiz_question_answered:${step}` })),
    { label: "Deixou o contato", event_name: "lead_captured" },
    { label: "Concluiu o quiz", event_name: "quiz_completed" },
    { label: "Viu o resultado", event_name: "result_viewed" },
    { label: "Viu a oferta", event_name: "offer_viewed" },
    { label: "Foi pro checkout", event_name: "checkout_started" },
  ];
}
