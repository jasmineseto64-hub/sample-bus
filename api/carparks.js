/**
 * LTA DataMall Car Park Availability Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
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
        'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
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
      console.error('Carparks fetch error:', err);
    }
  }

  // Simulated fallback carpark lots in Orchard / Somerset / Dhoby Ghaut
  return res.status(200).json({
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
    value: [
      {
        CarParkID: 'ORC01',
        Area: 'Orchard',
        Development: 'Mandarin Gallery / Mandarin Orchard',
        Location: '1.3023 103.8365',
        AvailableLots: 84,
        LotType: 'C',
        Agency: 'URA',
      },
      {
        CarParkID: 'ORC02',
        Area: 'Orchard',
        Development: '313@Somerset',
        Location: '1.3009 103.8384',
        AvailableLots: 122,
        LotType: 'C',
        Agency: 'LTA',
      },
      {
        CarParkID: 'DHB01',
        Area: 'Dhoby Ghaut',
        Development: 'Plaza Singapura',
        Location: '1.3005 103.8450',
        AvailableLots: 310,
        LotType: 'C',
        Agency: 'LTA',
      },
    ],
    isLive: false,
    _notice: 'LTA_ACCOUNT_KEY not configured or upstream unreachable.',
  });
}
