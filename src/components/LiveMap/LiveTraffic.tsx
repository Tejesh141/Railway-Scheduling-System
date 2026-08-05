import TrainMap, { MapTrain } from './TrainMap';

const tracks: [number, number][][] = [
  // Mumbai – Delhi
  [[19.076, 72.877], [21.146, 79.088], [23.259, 77.412], [26.846, 80.946], [28.704, 77.102]],
  // Chennai – Bangalore
  [[13.082, 80.270], [12.971, 79.158], [12.977, 77.576]],
  // Kolkata – Patna
  [[22.572, 88.363], [25.594, 85.137]],
  // Hyderabad – Pune
  [[17.385, 78.486], [18.520, 73.856]],
  // Jaipur – Ahmedabad
  [[26.912, 75.787], [23.022, 72.571]],
];

const trains: MapTrain[] = [
  { id: 'TN-01', route: tracks[0], speed: 120, delay: 0,  initialProgress: 0.1, animSpeed: 0.018 },
  { id: 'TN-02', route: tracks[1], speed: 95,  delay: 5,  initialProgress: 0.3, animSpeed: 0.022 },
  { id: 'TN-03', route: tracks[2], speed: 110, delay: 0,  initialProgress: 0.5, animSpeed: 0.020 },
  { id: 'TN-04', route: tracks[3], speed: 85,  delay: 12, initialProgress: 0.2, animSpeed: 0.016 },
  { id: 'TN-05', route: tracks[4], speed: 100, delay: 0,  initialProgress: 0.7, animSpeed: 0.019 },
];

const onTime  = trains.filter(t => t.delay === 0).length;
const delayed = trains.filter(t => t.delay > 0).length;

const stats = [
  { label: 'Trains Active', value: trains.length },
  { label: 'On Time',       value: onTime,  accent: 'text-blue-600' },
  { label: 'Delayed',       value: delayed, accent: 'text-red-500' },
];

export default function LiveTraffic() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Traffic</h1>
        <p className="text-sm text-gray-400 mt-0.5">Real-time positions across active routes</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E2E0D8] shadow-sm px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.accent ?? 'text-gray-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <TrainMap trains={trains} tracks={tracks} />
    </div>
  );
}
