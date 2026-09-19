import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Target, ShieldCheck, Satellite } from 'lucide-react';

interface GlobePin {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  status: string;
  type: string;
  tone: 'cyan' | 'red' | 'green';
}

const PINS: GlobePin[] = [
  { id: 'noida', name: 'Noida Expressway', region: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, status: 'QUALIFIED', type: 'Urban Expansion', tone: 'cyan' },
  { id: 'wayanad', name: 'Wayanad Chooralmala', region: 'Kerala', lat: 11.5362, lng: 76.1325, status: 'DISASTER TRIAGE', type: 'Landslide Debris', tone: 'red' },
  { id: 'chamoli', name: 'Chamoli Rishiganga', region: 'Uttarakhand', lat: 30.4852, lng: 79.7128, status: 'WATCH', type: 'Glacial Hazard', tone: 'cyan' },
  { id: 'kaziranga', name: 'Brahmaputra Basin', region: 'Assam', lat: 26.5775, lng: 93.1711, status: 'FLOOD ALERT', type: 'SAR Inundation', tone: 'red' },
];

export function EarthGlobe({ onSelectPin }: { onSelectPin?: (pinId: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedPin, setSelectedPin] = useState<GlobePin | null>(PINS[0]);
  const [hoveredPin, setHoveredPin] = useState<GlobePin | null>(null);

  // Rotation angles in radians
  const rotX = useRef<number>(0.25);
  const rotY = useRef<number>(-1.35); // Centered towards India initially
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let satelliteAngle = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Simplified continental polygon data points [lat, lng]
    const continents: [number, number][][] = [
      // India sub-continent outline
      [[35, 74], [32, 76], [28, 77], [22, 69], [15, 73], [8, 77], [13, 80], [20, 85], [24, 88], [27, 88], [28, 97], [24, 94], [22, 91], [27, 83], [30, 81], [35, 74]],
      // Asia general contour
      [[40, 70], [50, 60], [60, 70], [65, 90], [60, 120], [45, 130], [35, 125], [25, 110], [15, 105], [10, 100], [20, 95], [30, 80], [40, 70]],
      // Africa general contour
      [[35, -5], [30, 32], [10, 50], [-10, 40], [-34, 18], [-15, 12], [5, 2], [15, -16], [30, -10], [35, -5]],
      // Europe outline
      [[36, -9], [44, -1], [50, 2], [58, 6], [65, 15], [70, 28], [55, 38], [45, 35], [40, 26], [38, 20], [36, -9]],
      // Australia outline
      [[-12, 132], [-18, 145], [-35, 150], [-38, 140], [-32, 116], [-20, 114], [-12, 132]],
    ];

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.40;
      const cx = width / 2;
      const cy = height / 2;

      // Auto rotation
      if (isRotating && !isDragging.current) {
        rotY.current += 0.003;
      }
      satelliteAngle += 0.015;

      // 1. Draw outer atmospheric glow
      const atmosphereGlow = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.35);
      atmosphereGlow.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
      atmosphereGlow.addColorStop(0.3, 'rgba(37, 99, 235, 0.16)');
      atmosphereGlow.addColorStop(0.7, 'rgba(6, 182, 212, 0.04)');
      atmosphereGlow.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Globe Sphere Body (Dark Navy to Void)
      const sphereGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      sphereGrad.addColorStop(0, '#0F2642');
      sphereGrad.addColorStop(0.65, '#09182A');
      sphereGrad.addColorStop(1, '#050D18');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Spherical 3D Projection Helpers
      const project = (lat: number, lng: number): { x: number; y: number; z: number; visible: boolean } => {
        const phi = (lat * Math.PI) / 180;
        const theta = (lng * Math.PI) / 180;

        // Spherical to Cartesian
        let x = radius * Math.cos(phi) * Math.sin(theta);
        let y = -radius * Math.sin(phi);
        let z = radius * Math.cos(phi) * Math.cos(theta);

        // Rotate Y (longitude spin)
        const cosY = Math.cos(rotY.current);
        const sinY = Math.sin(rotY.current);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate X (pitch)
        const cosX = Math.cos(rotX.current);
        const sinX = Math.sin(rotX.current);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        return {
          x: cx + x1,
          y: cy + y2,
          z: z2,
          visible: z2 > 0, // In front of sphere
        };
      };

      // 4. Draw Graticule Lines (Latitude & Longitude Wireframe)
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';

      // Latitudes (-60 to +60 in steps of 30)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 10) {
          const pt = project(lat, lng);
          if (pt.visible) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else { ctx.lineTo(pt.x, pt.y); }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Longitudes (-180 to +180 in steps of 45)
      for (let lng = -180; lng <= 180; lng += 45) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 8) {
          const pt = project(lat, lng);
          if (pt.visible) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else { ctx.lineTo(pt.x, pt.y); }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 5. Draw Continents
      continents.forEach((poly) => {
        ctx.beginPath();
        let visibleCount = 0;
        poly.forEach(([lat, lng], i) => {
          const pt = project(lat, lng);
          if (pt.visible) visibleCount++;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        if (visibleCount > 2) {
          ctx.fillStyle = 'rgba(37, 99, 235, 0.14)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.38)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      });

      // 6. Draw Satellite Orbital Rings
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.25, radius * 0.45, -0.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.22)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Satellite 1: Sentinel-2 Optical
      const satX = cx + radius * 1.25 * Math.cos(satelliteAngle) * Math.cos(-0.4) - radius * 0.45 * Math.sin(satelliteAngle) * Math.sin(-0.4);
      const satY = cy + radius * 1.25 * Math.cos(satelliteAngle) * Math.sin(-0.4) + radius * 0.45 * Math.sin(satelliteAngle) * Math.cos(-0.4);

      // Satellite dot & beam
      ctx.fillStyle = '#67E8F9';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(satX, satY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sensor radar scanning line towards Earth
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.stroke();

      // Label Satellite
      ctx.font = '9px "DM Mono", monospace';
      ctx.fillStyle = '#67E8F9';
      ctx.fillText('SENTINEL-2A MSI', satX + 7, satY - 5);

      // 7. Render Active AOI Pins
      PINS.forEach((pin) => {
        const pt = project(pin.lat, pin.lng);
        if (pt.visible) {
          const isSelected = selectedPin?.id === pin.id;
          const isHovered = hoveredPin?.id === pin.id;

          // Pulse ring
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 12 : 7, 0, Math.PI * 2);
          ctx.fillStyle = pin.tone === 'red' ? 'rgba(220, 38, 38, 0.22)' : 'rgba(6, 182, 212, 0.22)';
          ctx.fill();

          // Pin point
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = pin.tone === 'red' ? '#F87171' : '#38BDF8';
          ctx.shadowColor = pin.tone === 'red' ? '#DC2626' : '#06B6D4';
          ctx.shadowBlur = isSelected ? 14 : 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Pin Label Box
          if (isSelected || isHovered) {
            ctx.fillStyle = 'rgba(7, 17, 31, 0.88)';
            ctx.strokeStyle = pin.tone === 'red' ? 'rgba(220, 38, 38, 0.6)' : 'rgba(6, 182, 212, 0.6)';
            ctx.lineWidth = 1;
            const textWidth = ctx.measureText(pin.name).width;
            ctx.fillRect(pt.x + 8, pt.y - 14, textWidth + 14, 22);
            ctx.strokeRect(pt.x + 8, pt.y - 14, textWidth + 14, 22);

            ctx.font = 'bold 9px "DM Mono", monospace';
            ctx.fillStyle = '#F8FAFC';
            ctx.fillText(pin.name, pt.x + 15, pt.y);
          }
        }
      });

      // 8. Draw Glass Sphere Rim Highlight
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      const rimGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      rimGrad.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
      rimGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.2)');
      rimGrad.addColorStop(1, 'rgba(6, 182, 212, 0.5)');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse drag interaction
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        rotY.current += dx * 0.006;
        rotX.current = Math.max(-0.8, Math.min(0.8, rotX.current - dy * 0.006));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isRotating, selectedPin, hoveredPin]);

  const selectPin = (pin: GlobePin) => {
    setSelectedPin(pin);
    // Align view towards this pin
    rotY.current = -(pin.lng * Math.PI) / 180 + Math.PI / 2;
    rotX.current = (pin.lat * Math.PI) / 180 * 0.4;
    if (onSelectPin) onSelectPin(pin.id);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[460px] select-none">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[480px] cursor-grab active:cursor-grabbing max-w-[620px]"
      />

      {/* Floating Orbital Controls */}
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-[#07111F]/80 p-1.5 backdrop-blur-md">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors ${
            isRotating ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
          }`}
          title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
          data-testid="button-toggle-globe-rotation"
        >
          {isRotating ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button
          onClick={() => {
            rotX.current = 0.25;
            rotY.current = -1.35;
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset to India focus"
          data-testid="button-reset-globe-view"
        >
          <RotateCcw size={13} />
        </button>
        <span className="font-mono text-[9px] text-slate-400 px-2 tracking-wider">
          ORBITAL 3D CANVAS
        </span>
      </div>

      {/* Active Investigations Quick Pills */}
      <div className="absolute bottom-3 inset-x-4 flex flex-wrap justify-center gap-2 pointer-events-auto">
        {PINS.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => selectPin(pin)}
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all backdrop-blur-md ${
                isSelected
                  ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'border-slate-800 bg-[#07111F]/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
              data-testid={`button-globe-pin-${pin.id}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  pin.tone === 'red' ? 'bg-red-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              <span className="font-medium text-[11px]">{pin.name}</span>
              <span className="font-mono text-[9px] text-slate-500 hidden sm:inline">
                {pin.type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
