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

<<<<<<< HEAD
export interface StationTrackInfo {
  station: string;
  line: 'Main Line' | 'Loop Line';
  platform: number;
  minSpeed?: number; // km/h — only set when routed to Loop Line
}

=======
>>>>>>> 132c36664a82f06eca938b7db88af59fdbce5d1a
export interface Recommendation {
  id: string;
  trainId: string;
  trainName: string;
  action: string;
  explanation: string;
  delayReduction: number;
  timestamp: Date;
  defaultAction: 'accepted' | 'overridden';
  priority: 'High' | 'Medium' | 'Low';
<<<<<<< HEAD
  conflictsWith?: string;
  trackAssignment?: StationTrackInfo[]; // station-wise track & platform for accepted train
=======
  conflictsWith?: string; // id of the other recommendation it conflicts with
>>>>>>> 132c36664a82f06eca938b7db88af59fdbce5d1a
}

export interface Metrics {
  averageDelay: number;
  trainsPerHour: number;
  trackUtilization: number;
  onTimePerformance: number;
}

export type Page = 'home' | 'dashboard' | 'live-map' | 'conflicts' | 'recommendations' | 'settings';
