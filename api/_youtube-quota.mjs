export const QUOTA_MESSAGE = 'A cota diária do YouTube acabou. A atualização foi interrompida e os dados salvos foram mantidos. Aguarde a renovação da cota.';
export function createYouTubeQuotaGuard(now = () => new Date()) {
  let exhaustedDay = '';
  const day = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(now());
  const quotaError = () => Object.assign(new Error(QUOTA_MESSAGE), { code: 'YOUTUBE_QUOTA_EXCEEDED', status: 429 });
  return async request => {
    if (exhaustedDay === day()) throw quotaError();
    const response = await request();
    if (!response.ok) {
      const body = await response.text();
      if (response.status === 403 && /quotaExceeded|dailyLimitExceeded/.test(body)) {
        exhaustedDay = day();
        throw quotaError();
      }
      throw new Error(`YouTube API error ${response.status}: ${body}`);
    }
    return response.json();
  };
}
