import { ArrivalPrediction, BusService, CrowdLevel, VehicleType } from '../types/transit';
import { BUS_SERVICES_DATA } from '../data/transitData';

export interface LtaRawBusArrival {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: Array<{
    ServiceNo: string;
    Operator: string;
    NextBus?: LtaRawNextBus;
    NextBus2?: LtaRawNextBus;
    NextBus3?: LtaRawNextBus;
  }>;
  isLive?: boolean;
  source?: string;
  _notice?: string;
}

export interface LtaRawNextBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Monitored?: number;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
}

export function parseLoadCode(code?: string): { load: CrowdLevel; percent: number } {
  if (code === 'SEA') {
    return { load: 'Seats Available', percent: 35 };
  }
  if (code === 'SDA') {
    return { load: 'Standing Available', percent: 72 };
  }
  if (code === 'LSD') {
    return { load: 'Limited Standing', percent: 90 };
  }
  return { load: 'Seats Available', percent: 25 };
}

export function parseVehicleType(type?: string): VehicleType {
  if (type === 'DD') return 'Double Deck (DD)';
  if (type === 'BD') return 'Articulated (BD)';
  return 'Single Deck (SD)';
}

export function computeEtaMinutes(isoString?: string): number | 'Arr' {
  if (!isoString) return 99;
  const target = new Date(isoString).getTime();
  if (isNaN(target)) return 99;
  const now = Date.now();
  const diffSec = Math.round((target - now) / 1000);
  const diffMin = Math.round(diffSec / 60);

  if (diffMin <= 1) return 'Arr';
  return diffMin;
}

export function mapRawBusToPrediction(raw?: LtaRawNextBus): ArrivalPrediction | null {
  if (!raw || !raw.EstimatedArrival) return null;
  const { load, percent } = parseLoadCode(raw.Load);
  const etaMinutes = computeEtaMinutes(raw.EstimatedArrival);

  return {
    etaMinutes,
    estimatedArrivalTimestamp: raw.EstimatedArrival,
    load,
    loadPercent: percent,
    vehicleType: parseVehicleType(raw.Type),
    isWheelchairAccessible: raw.Feature === 'WAB',
  };
}

/**
 * Fetch bus arrivals for a stop from the local /api/bus-arrival proxy
 */
export async function fetchBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaRawBusArrival | null> {
  try {
    let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch bus arrival from /api/bus-arrival:', err);
    return null;
  }
}

/**
 * Check API health and LTA connection
 */
export async function checkApiHealth() {
  try {
    const res = await fetch('/api/health?checkUpstream=true');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
