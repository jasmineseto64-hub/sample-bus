/**
 * LTA DataMall Train Service Alerts (MRT/LRT disruptions)
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.LTA_ACCOUNT_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const response = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
        {
          headers: {
            AccountKey: apiKey.trim(),
            accept: 'application/json',
          },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ ...data, isLive: true });
      }
    } catch (err) {
      console.error('Train alerts fetch error:', err);
    }
  }

  // Fallback: Status 1 = Normal, Status 2 = Disruptions
  return res.status(200).json({
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
    value: {
      Status: 1, // 1 = Normal, 2 = Disrupted
      Message: 'All MRT and LRT train lines are operating normally.',
      AffectedSegments: [],
    },
    isLive: false,
  });
}
