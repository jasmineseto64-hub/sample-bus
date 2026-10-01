/**
 * LTA DataMall v3 Bus Arrival API Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 * Compatible with Vercel Serverless and Node.js/Express
 */

export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};
  const busStopCode = (query.BusStopCode || query.busStopCode || '09037').toString().trim();
  const serviceNo = (query.ServiceNo || query.serviceNo || '').toString().trim();

  const apiKey = process.env.LTA_ACCOUNT_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo) {
        ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
      }

      const response = await fetch(ltaUrl, {
        method: 'GET',
        headers: {
          AccountKey: apiKey.trim(),
          accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `Upstream LTA DataMall returned HTTP ${response.status}`,
          status: response.status,
          details: errorText,
          isLive: false,
        });
      }

      const data = await response.json();
      return res.status(200).json({
        ...data,
        isLive: true,
        source: 'LTA DataMall v3 (Live Feed)',
      });
    } catch (err) {
      console.error('Error fetching live bus arrival from LTA:', err);
      // Fallback to simulated data if network times out or fails
      return res.status(200).json(generateFallbackBusArrival(busStopCode, serviceNo, true, err.message));
    }
  }

  // Fallback when LTA_ACCOUNT_KEY is not configured yet
  return res.status(200).json(generateFallbackBusArrival(busStopCode, serviceNo, false));
}

function generateFallbackBusArrival(busStopCode, serviceNo, hadError = false, errorMsg = '') {
  const now = Date.now();
  const servicesList = serviceNo ? [serviceNo] : ['65', '14', '106', '123', '175', '147'];

  const services = servicesList.map((svc) => {
    const min1 = Math.floor(Math.random() * 2);
    const min2 = min1 + 5 + Math.floor(Math.random() * 5);
    const min3 = min2 + 8 + Math.floor(Math.random() * 7);

    const eta1 = new Date(now + min1 * 60 * 1000).toISOString();
    const eta2 = new Date(now + min2 * 60 * 1000).toISOString();
    const eta3 = new Date(now + min3 * 60 * 1000).toISOString();

    return {
      ServiceNo: svc,
      Operator: ['65', '14', '123', '175', '147'].includes(svc) ? 'SBST' : 'SMRT',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: eta1,
        Monitored: 1,
        Latitude: '1.30214',
        Longitude: '103.83612',
        VisitNumber: '1',
        Load: min1 === 0 ? 'SEA' : 'SDA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: eta2,
        Monitored: 1,
        Latitude: '1.29840',
        Longitude: '103.84210',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: eta3,
        Monitored: 1,
        Latitude: '1.28510',
        Longitude: '103.85040',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
    };
  });

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    BusStopCode: busStopCode,
    Services: services,
    isLive: false,
    _notice: hadError
      ? `Upstream error encountered: ${errorMsg}. Returned simulated LTA v3 data.`
      : 'LTA_ACCOUNT_KEY environment variable is not configured. Add it in Vercel to receive real-time production feeds.',
  };
}
