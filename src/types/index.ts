export type TrainType = 'Express' | 'Passenger' | 'Freight';
export type TrainStatus = 'Running' | 'Waiting' | 'Crossing' | 'Diverted' | 'Emergency Stop';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type ConflictSeverity = 'Critical' | 'Warning' | 'Minor';
export type InstructionType = 'HOLD' | 'SPEED_UP' | 'SLOW_DOWN' | 'DIVERT' | 'CLEAR_TRACK' | 'EMERGENCY_STOP' | 'RESUME';

export interface GpsCoord {
  lat: number;
  lng: number;
}

export interface Train {
  id: string;
  name: string;
  type: TrainType;
  currentStation: string;
  nextStation: string;
  delay: number;
  priority: PriorityLevel;
  status: TrainStatus;
  speed: number;
  route: string[];
  position: { x: number; y: number };
  gps: GpsCoord;
  heading: number;
  routeIndex: number;
  gpsRoute: GpsCoord[];
  segmentProgress: number;
}

export interface Conflict {
  id: string;
  trainId1: string;
  trainId2: string;
  trainName1: string;
  trainName2: string;
  location: string;
  timeToConflict: number;
  severity: ConflictSeverity;
}

export interface AIInstruction {
  id: string;
  trainId: string;
  trainName: string;
  type: InstructionType;
  instruction: string;
  reasoning: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  issuedAt: Date;
  autoDispatched: boolean;
  acknowledged: boolean;
}

export interface Recommendation {
  id: string;
  trainId: string;
  trainName: string;
  action: string;
  explanation: string;
  delayReduction: number;
  timestamp: Date;
}

export interface Metrics {
  averageDelay: number;
  trainsPerHour: number;
  trackUtilization: number;
  onTimePerformance: number;
}

export type Page = 'home' | 'dashboard' | 'live-map' | 'conflicts' | 'recommendations' | 'settings';
