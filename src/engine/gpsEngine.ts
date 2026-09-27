import { Train, GpsCoord } from '../types';

function speedToDegPerSec(speedKmh: number) {
  return speedKmh / (111 * 3600);
}

function interpolate(a: GpsCoord, b: GpsCoord, t: number): GpsCoord {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

function segmentLength(a: GpsCoord, b: GpsCoord): number {
  const dlat = b.lat - a.lat;
  const dlng = (b.lng - a.lng) * Math.cos((a.lat * Math.PI) / 180);
  return Math.sqrt(dlat * dlat + dlng * dlng);
}

function calcHeading(a: GpsCoord, b: GpsCoord): number {
  const dlat = b.lat - a.lat;
  const dlng = b.lng - a.lng;
  return (Math.atan2(dlng, dlat) * 180) / Math.PI;
}

export function stepTrain(train: Train, deltaSeconds: number): Partial<Train> {
  if (train.status === 'Waiting' || train.status === 'Emergency Stop' || train.speed === 0) return {};

  const route = train.gpsRoute;
  if (!route || route.length < 2) return {};

  let idx = train.routeIndex;
  let progress = train.segmentProgress;
  if (idx >= route.length - 1) return {};

  const distPerSec = speedToDegPerSec(train.speed);
  const segLen = segmentLength(route[idx], route[idx + 1]);
  if (segLen === 0) return {};

  progress += (distPerSec * deltaSeconds) / segLen;

  while (progress >= 1.0 && idx < route.length - 2) {
    progress -= 1.0;
    idx += 1;
  }
  if (progress > 1.0) progress = 1.0;

  const gps = interpolate(route[idx], route[idx + 1], progress);
  const heading = calcHeading(route[idx], route[idx + 1]);

  return { gps, heading, routeIndex: idx, segmentProgress: progress };
}

export function haversineKm(a: GpsCoord, b: GpsCoord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}
