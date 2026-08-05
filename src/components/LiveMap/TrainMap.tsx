import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapTrain {
  id: string;
  route: [number, number][];
  speed: number;
  delay: number;
  initialProgress: number;
  animSpeed: number;
}

interface TrainMapProps {
  trains: MapTrain[];
  tracks: [number, number][][];
}

function interpolate(coords: [number, number][], t: number): [number, number] {
  if (coords.length < 2) return coords[0];
  const total = coords.length - 1;
  const scaled = t * total;
  const i = Math.min(Math.floor(scaled), total - 1);
  const frac = scaled - i;
  const a = coords[i], b = coords[i + 1];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

interface TrainOverlayProps {
  trains: MapTrain[];
}

function TrainOverlay({ trains }: TrainOverlayProps) {
  const map = useMap();
  const progressRef = useRef<Record<string, number>>({});
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  // init progress
  useEffect(() => {
    trains.forEach(t => {
      if (progressRef.current[t.id] === undefined)
        progressRef.current[t.id] = t.initialProgress;
    });
  }, [trains]);

  // animate
  useEffect(() => {
    const animate = (ts: number) => {
      const delta = lastTimeRef.current !== null ? (ts - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = ts;

      trains.forEach(t => {
        progressRef.current[t.id] = (progressRef.current[t.id] + t.animSpeed * delta) % 1;
      });

      const next: Record<string, { x: number; y: number }> = {};
      trains.forEach(t => {
        const latlng = interpolate(t.route, progressRef.current[t.id]);
        const pt = map.latLngToContainerPoint(L.latLng(latlng[0], latlng[1]));
        next[t.id] = { x: pt.x, y: pt.y };
      });
      setPositions(next);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [map, trains]);

  // recompute on map move/zoom
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    map.on('move zoom', handler);
    return () => { map.off('move zoom', handler); };
  }, [map]);

  return (
    <>
      {trains.map(train => {
        const pos = positions[train.id];
        if (!pos) return null;
        const isDelayed = train.delay > 0;
        const color = isDelayed ? '#ef4444' : '#2563EB';

        return (
          <div
            key={train.id}
            style={{ position: 'absolute', left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)', zIndex: 1000, pointerEvents: 'auto' }}
            onMouseEnter={() => setHoveredId(train.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* pulse ring — only for delayed trains */}
            {isDelayed && (
              <motion.div
                style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${color}`, position: 'absolute', top: -4, left: -4 }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {/* dot */}
            <motion.div
              style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: '2px solid white', boxShadow: `0 0 5px ${color}`, cursor: 'pointer' }}
              whileHover={{ scale: 1.4 }}
            />
            {/* tooltip */}
            <AnimatePresence>
              {hoveredId === train.id && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
                    background: '#0f172a', color: '#f1f5f9', borderRadius: 8, padding: '6px 10px',
                    fontSize: 11, whiteSpace: 'nowrap', pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 2000,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{train.id}</div>
                  <div>{train.speed} km/h</div>
                  <div style={{ color: isDelayed ? '#f87171' : '#4ade80' }}>
                    {isDelayed ? `+${train.delay} min` : 'On Time'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

export default function TrainMap({ trains, tracks }: TrainMapProps) {
  const onTime = trains.filter(t => t.delay === 0).length;
  const delayed = trains.filter(t => t.delay > 0).length;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E2E0D8] shadow-sm" style={{ position: 'relative' }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: 520, width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {tracks.map((coords, i) => (
          <Polyline
            key={i}
            positions={coords}
            pathOptions={{ color: '#334155', weight: 2.5, dashArray: '6 4' }}
          />
        ))}
        <TrainOverlay trains={trains} />
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
        background: 'rgba(15,23,42,0.85)', borderRadius: 12, padding: '10px 14px',
        backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563EB', boxShadow: '0 0 6px #2563EB' }} />
            <span style={{ color: '#cbd5e1', fontSize: 11 }}>On Time ({onTime})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
            <span style={{ color: '#cbd5e1', fontSize: 11 }}>Delayed ({delayed})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 2, background: '#334155', borderTop: '2px dashed #475569' }} />
            <span style={{ color: '#cbd5e1', fontSize: 11 }}>Track</span>
          </div>
        </div>
      </div>
    </div>
  );
}
