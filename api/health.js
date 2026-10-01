/**
 * Health check endpoint for LTA transit APIs
 * Compatible with Vercel Serverless Functions and Node.js/Express
 */
export default async function handler(req, res) {
  const apiKey = process.env.LTA_ACCOUNT_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim().length > 0);

  let upstreamLtaStatus = 'unchecked';
  let upstreamLatencyMs = null;

  // If client passes ?checkUpstream=true, perform a live ping to LTA DataMall v3
  const shouldCheckUpstream = req.query?.checkUpstream === 'true' || req.query?.checkUpstream === '1';

  if (shouldCheckUpstream && isKeyConfigured) {
    const startTime = Date.now();
    try {
      const response = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139',
        {
          headers: {
            AccountKey: apiKey,
            accept: 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      upstreamLatencyMs = Date.now() - startTime;
      upstreamLtaStatus = response.ok ? 'connected' : `upstream_error_${response.status}`;
    } catch (err) {
      upstreamLatencyMs = Date.now() - startTime;
      upstreamLtaStatus = `network_unreachable: ${err.message || 'timeout'}`;
    }
  }

  const payload = {
    status: isKeyConfigured ? 'ok' : 'degraded',
    message: isKeyConfigured
      ? 'LTA DataMall API proxy is operational and ready.'
      : 'LTA_ACCOUNT_KEY is not yet configured in environment variables. Running in simulation/fallback mode.',
    timestamp: new Date().toISOString(),
    environment: {
      ltaApiKeyConfigured: isKeyConfigured,
      platform: process.env.VERCEL ? 'vercel_serverless' : 'node_runtime',
    },
    upstream: {
      status: upstreamLtaStatus,
      latencyMs: upstreamLatencyMs,
    },
    endpoints: {
      busArrival: '/api/bus-arrival?BusStopCode=83139[&ServiceNo=15]',
      carParks: '/api/carparks',
      trafficIncidents: '/api/traffic-incidents',
      trainAlerts: '/api/train-alerts',
      health: '/api/health[?checkUpstream=true]',
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res.status(200).json(payload);
}
