import TrainMap, { MapTrain } from './TrainMap';

export const tracks: [number, number][][] = [
  [[19.076, 72.877], [21.146, 79.088], [23.259, 77.412], [26.846, 80.946], [28.704, 77.102]], // Mumbai–Delhi
  [[13.082, 80.270], [12.971, 79.158], [12.977, 77.576]],                                      // Chennai–Bangalore
  [[22.572, 88.363], [25.594, 85.137], [25.594, 85.137]],                                      // Kolkata–Patna
  [[17.385, 78.486], [18.520, 73.856]],                                                         // Hyderabad–Pune
  [[26.912, 75.787], [23.022, 72.571]],                                                         // Jaipur–Ahmedabad
  [[28.704, 77.102], [30.733, 76.779], [31.634, 74.872]],                                      // Delhi–Amritsar
  [[13.082, 80.270], [14.674, 78.824], [17.385, 78.486]],                                      // Chennai–Hyderabad
  [[22.572, 88.363], [23.810, 86.441], [21.146, 79.088]],                                      // Kolkata–Nagpur
  [[19.076, 72.877], [18.520, 73.856], [16.705, 74.243]],                                      // Mumbai–Kolhapur
  [[12.977, 77.576], [11.664, 78.146], [10.790, 79.132]],                                      // Bangalore–Trichy
  [[26.846, 80.946], [25.317, 82.973], [25.594, 85.137]],                                      // Lucknow–Patna
  [[23.259, 77.412], [22.719, 75.857], [22.303, 73.193]],                                      // Bhopal–Vadodara
  [[28.704, 77.102], [27.176, 78.008], [26.846, 80.946]],                                      // Delhi–Lucknow
  [[17.385, 78.486], [16.306, 80.436], [14.674, 78.824]],                                      // Hyderabad–Nellore
  [[21.146, 79.088], [20.272, 85.834], [22.572, 88.363]],                                      // Nagpur–Kolkata
  [[23.022, 72.571], [22.303, 73.193], [21.170, 72.831]],                                      // Ahmedabad–Surat
  [[25.317, 82.973], [24.585, 81.876], [23.259, 77.412]],                                      // Varanasi–Bhopal
  [[10.790, 79.132], [9.939, 78.121], [8.730, 77.700]],                                        // Trichy–Madurai–Nagercoil
  [[31.634, 74.872], [32.084, 76.920], [32.220, 77.588]],                                      // Amritsar–Pathankot–Shimla
  [[26.912, 75.787], [27.176, 78.008], [25.317, 82.973]],                                      // Jaipur–Agra–Varanasi
];

const ROUTE_NAMES = [
  'Mumbai–Delhi', 'Chennai–Bangalore', 'Kolkata–Patna', 'Hyderabad–Pune', 'Jaipur–Ahmedabad',
  'Delhi–Amritsar', 'Chennai–Hyderabad', 'Kolkata–Nagpur', 'Mumbai–Kolhapur', 'Bangalore–Trichy',
  'Lucknow–Patna', 'Bhopal–Vadodara', 'Delhi–Lucknow', 'Hyderabad–Nellore', 'Nagpur–Kolkata',
  'Ahmedabad–Surat', 'Varanasi–Bhopal', 'Trichy–Nagercoil', 'Amritsar–Shimla', 'Jaipur–Varanasi',
];

// Generate 100 trains spread across 20 routes (5 per route)
export const trains: MapTrain[] = Array.from({ length: 100 }, (_, i) => {
  const routeIdx = i % 20;
  const trainNum = Math.floor(i / 20) + 1;
  const delayChance = Math.random();
  const delay = delayChance < 0.25 ? Math.floor(Math.random() * 20) + 2 : 0; // ~25% delayed
  return {
    id: `${ROUTE_NAMES[routeIdx].split('–')[0].slice(0, 3).toUpperCase()}-${String(routeIdx * 5 + trainNum).padStart(3, '0')}`,
    route: tracks[routeIdx],
    speed: 80 + Math.floor(Math.random() * 60),
    delay,
    initialProgress: (trainNum - 1) * 0.2 + Math.random() * 0.15,
    animSpeed: 0.014 + Math.random() * 0.012,
  };
});

const onTime  = trains.filter(t => t.delay === 0).length;
const delayed = trains.filter(t => t.delay > 0).length;
const avgSpeed = Math.round(trains.reduce((s, t) => s + t.speed, 0) / trains.length);

const stats = [
  { label: 'Trains Active', value: trains.length },
  { label: 'On Time',       value: onTime  },
  { label: 'Delayed',       value: delayed },
  { label: 'Avg Speed',     value: `${avgSpeed} km/h` },
];

export default function LiveTraffic() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Live Traffic</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B6B7B' }}>Real-time positions across active routes</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border px-5 py-4" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <p className="text-xs mb-1" style={{ color: '#6B6B7B' }}>{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: '#1A1A2E' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <TrainMap trains={trains} tracks={tracks} />
    </div>
  );
}
