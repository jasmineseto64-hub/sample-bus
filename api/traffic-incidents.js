/**
 * LTA DataMall Traffic Incidents Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
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
        'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
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
      console.error('Traffic incidents fetch error:', err);
    }
  }

  // Fallback
  return res.status(200).json({
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
    value: [
      {
        Type: 'Road Diversion',
        Latitude: 1.2931,
        Longitude: 103.8558,
        Message: '(20/9) 00:01 Road closure along Nicoll Highway towards Esplanade due to Formula 1 Singapore Grand Prix. Expect heavy delays.',
      },
      {
        Type: 'Heavy Traffic',
        Latitude: 1.3032,
        Longitude: 103.8340,
        Message: '(1/10) 17:30 Heavy traffic on Orchard Road towards Bras Basah between Scotts Road and Grange Road.',
      },
    ],
    isLive: false,
  });
}
