export type CrowdLevel = 'Seats Available' | 'Standing Available' | 'Limited Standing';
export type CrowdCode = 'SEA' | 'SDA' | 'LSD';
export type VehicleType = 'Double Deck (DD)' | 'Single Deck (SD)' | 'Articulated (BD)';
export type BusCategory = 'Trunk' | 'Express' | 'Feeder';

export interface ArrivalPrediction {
  etaMinutes: number | 'Arr';
  estimatedArrivalTimestamp: string;
  load: CrowdLevel;
  loadPercent: number;
  vehicleType: VehicleType;
  isWheelchairAccessible: boolean;
  vehicleReg?: string;
  vehicleModel?: string;
}

export interface RouteStop {
  stopCode: string;
  name: string;
  roadName: string;
  mrtLines?: { code: string; bg: string; text?: string }[];
  isPassed: boolean;
  isCurrent: boolean;
  departedTime?: string;
  estMinutes?: string | number;
  distanceMetres?: number;
  platformBay?: string;
}

export interface BusService {
  serviceNo: string;
  category: BusCategory;
  direction1: {
    origin: string;
    destination: string;
    via: string;
    stops: RouteStop[];
    arrivals: [ArrivalPrediction, ArrivalPrediction, ArrivalPrediction];
    vehicleReg: string;
    vehicleModel: string;
    lastPingSecondsAgo: number;
    currentSpeedKmh: number;
    approachingDistanceMetres: number;
  };
  direction2: {
    origin: string;
    destination: string;
    via: string;
    stops: RouteStop[];
    arrivals: [ArrivalPrediction, ArrivalPrediction, ArrivalPrediction];
    vehicleReg: string;
    vehicleModel: string;
    lastPingSecondsAgo: number;
    currentSpeedKmh: number;
    approachingDistanceMetres: number;
  };
  firstBus: string;
  lastBus: string;
  frequency: {
    peak: string;
    offPeak: string;
  };
}

export interface BusStopInfo {
  code: string;
  name: string;
  roadName: string;
  distanceMetres: number;
  walkingMins: number;
  services: string[];
}

export interface ServiceAdvisory {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  dateRange: string;
  affectedServices: string[];
  severity: 'info' | 'warning' | 'critical';
}
