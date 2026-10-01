import assert from "node:assert/strict";
import { fetchTrackingEvents, buildSequentialFunnel, quizFunnelSteps } from "../api/_analytics.mjs";
import { buildOverview, resolveRange } from "../api/_core.mjs";

const dataset = Array.from({ length: 2771 }, (_, index) => ({
  id: String(index).padStart(5, "0"), site_key: "site", session_id: `s${index}`,
  event_type: "pageview", event_name: "pageview",
  created_at: index < 1000 ? "2026-09-15T12:00:00Z" : "2026-09-30T23:00:00Z",
}));
function database(cap, failAt = -1) {
  let calls = 0;
  return { from(table) {
    assert.equal(table, "tracking_events");
    const query = {
      select() { return this; }, gte() { return this; }, lte() { return this; },
      order() { return this; }, eq() { return this; }, in() { return this; },
      range(start, end) {
        if (calls++ === failAt) return Promise.resolve({ error: { message: "database unavailable" } });
        return Promise.resolve({ data: dataset.slice(start, Math.min(end + 1, start + cap)), count: dataset.length });
      },
    };
    return query;
  } };
}
const range = resolveRange(new URLSearchParams("from=2026-09-02&to=2026-10-01&tz=240"));
for (const cap of [1000, 300]) {
  const rows = await fetchTrackingEvents(database(cap), { range });
  assert.equal(rows.length, 2771);
  assert.equal(new Set(rows.map(row => row.id)).size, 2771);
  const overview = buildOverview(rows, range);
  assert.equal(overview.timeseries.length, 30);
  assert.equal(overview.timeseries.find(point => point.day === "2026-09-30").pageviews, 1771);
  assert.equal(overview.timeseries.reduce((sum, point) => sum + point.events, 0), overview.totals.events);
}
await assert.rejects(fetchTrackingEvents(database(1000, 1), { range }), /database unavailable/);
const midnight = buildOverview([{ ...dataset[0], created_at: "2026-10-01T03:30:00Z", event_type: "custom" }], range);
assert.equal(midnight.timeseries.find(point => point.day === "2026-09-30").events, 1);
assert.equal(midnight.timeseries.find(point => point.day === "2026-10-01").events, 0);

const event = (session, name, second, site = "a", meta = {}) => ({
  id: `${session}-${second}-${name}`, session_id: session, site_key: site,
  event_name: name, event_type: name === "pageview" ? name : "custom", meta,
  created_at: `2026-09-29T12:00:${String(second).padStart(2, "0")}Z`, path: "/quiz",
});
const steps = [{ label: "Entrada", event_name: "pageview" }, { label: "Final", event_name: "quiz_completed" }];
const funnel = buildSequentialFunnel([
  event("1", "pageview", 1), event("1", "quiz_completed", 2), event("1", "quiz_completed", 3),
  event("2", "quiz_completed", 1), event("2", "pageview", 2),
  event("3", "pageview", 1, "a"), event("3", "quiz_completed", 2, "b"),
], steps);
assert.deepEqual(funnel.map(step => step.sessions), [3, 2]);
assert.equal(funnel[0].dropped, 1);
assert.equal(funnel[1].completionRate, 2 / 3);
const quizRows = [event("1", "quiz_started", 0), event("1", "quiz_question_answered", 1, "a", { step: 1 }), event("1", "quiz_question_answered", 2, "a", { step: 2 }), event("2", "quiz_started", 0), event("2", "quiz_question_answered", 1, "a", { step: 1 })];
const quizSteps = quizFunnelSteps(quizRows);
assert.deepEqual(buildSequentialFunnel(quizRows, quizSteps).slice(0, 3).map(step => step.sessions), [2, 2, 1]);
assert.equal(buildSequentialFunnel([event("1", "pageview", 1)], [{ label: "Quiz", event_name: "path:/quiz" }])[0].sessions, 1);
console.log("Analytics OK: full pagination, recent days, timezone, all events, same-session progression, reordered beacons, question drop-off and route steps.");
