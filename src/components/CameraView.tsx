import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize2, Minimize2, Flame, CloudFog, ShieldAlert, Sparkles, Check, HardHat, Footprints, Shield } from 'lucide-react';
import { CameraFeed, DetectedWorker, DetectedHazard } from '../types/safety';

interface CameraViewProps {
  camera: CameraFeed;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onSelectWorker?: (worker: DetectedWorker, camera: CameraFeed) => void;
  onSimulateHazard?: (camera: CameraFeed, type: 'fire' | 'smoke' | 'ppe') => void;
  onCaptureSnapshot?: (camera: CameraFeed) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  camera,
  isExpanded = false,
  onToggleExpand,
  onSelectWorker,
  onSimulateHazard,
  onCaptureSnapshot,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live timestamp clock simulation for CCTV
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${Math.floor(now.getMilliseconds() / 100)}`;
      setCurrentTimeStr(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 200);
    return () => clearInterval(interval);
  }, []);

  const handleSnapshot = () => {
    if (onCaptureSnapshot) {
      onCaptureSnapshot(camera);
      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 1500);
    }
  };

  const hasFire = camera.hazards.some((h) => h.type === 'fire');
  const hasSmoke = camera.hazards.some((h) => h.type === 'smoke');
  const hasViolations = camera.workers.some((w) => !w.isCompliant);

  return (
    <div
      ref={containerRef}
      className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 bg-slate-950 ${
        hasFire
          ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
          : hasSmoke
          ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
          : hasViolations
          ? 'border-amber-600/50'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* CCTV Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              hasFire
                ? 'bg-red-500 animate-ping'
                : hasSmoke
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400'
            }`}
          />
          <span className="font-mono font-semibold text-slate-200 truncate">{camera.id}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">{camera.zone}</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="hidden sm:inline">{camera.fps} FPS</span>
          <span className="hidden md:inline">{camera.bitrate}</span>
          <div className="flex items-center gap-1">
            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title={isExpanded ? 'Minimize View' : 'Maximize View'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Video Viewport & Overlays */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 select-none">
        <img
          src={camera.imagePoster}
          alt={camera.name}
          className="w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 cctv-scanline opacity-60 pointer-events-none" />

        {/* OSD (On-Screen Display) Telemetry HUD */}
        <div className="absolute top-2 left-2 pointer-events-none font-mono text-[11px] text-emerald-400/90 drop-shadow flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="bg-red-600/90 text-white font-bold px-1.5 py-0.2 rounded text-[10px] animate-pulse">
              ● REC
            </span>
            <span className="bg-black/60 px-1.5 py-0.5 rounded text-white">{currentTimeStr}</span>
          </div>
          <span className="bg-black/60 px-1.5 py-0.5 rounded text-slate-300 w-fit text-[10px]">
            GEO: {camera.factory} / {camera.building}
          </span>
        </div>

        {/* Emergency Hazard Banner in Frame */}
        {hasFire && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg animate-bounce flex items-center gap-1.5 z-20">
            <Flame className="w-4 h-4 fill-white" />
            <span>CRITICAL FIRE DETECTED</span>
          </div>
        )}

        {hasSmoke && !hasFire && (
          <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-1 rounded shadow-lg animate-pulse flex items-center gap-1.5 z-20">
            <CloudFog className="w-4 h-4" />
            <span>SMOKE PLUME DETECTED</span>
          </div>
        )}

        {/* Bounding Box: Detected Fire Hazards */}
        {camera.hazards
          .filter((h) => h.type === 'fire')
          .map((hazard) => (
            <div
              key={hazard.id}
              style={{
                left: `${hazard.bbox.x}%`,
                top: `${hazard.bbox.y}%`,
                width: `${hazard.bbox.w}%`,
                height: `${hazard.bbox.h}%`,
              }}
              className="absolute z-10 border-2 border-red-500 rounded bg-red-600/20 shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse"
            >
              <div className="absolute -top-6 left-0 bg-red-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap shadow">
                <Flame className="w-3 h-3 fill-white" />
                <span>FIRE DETECTED {hazard.confidence.toFixed(1)}%</span>
              </div>
            </div>
          ))}

        {/* Bounding Box: Detected Smoke Hazards */}
        {camera.hazards
          .filter((h) => h.type === 'smoke')
          .map((hazard) => (
            <div
              key={hazard.id}
              style={{
                left: `${hazard.bbox.x}%`,
                top: `${hazard.bbox.y}%`,
                width: `${hazard.bbox.w}%`,
                height: `${hazard.bbox.h}%`,
              }}
              className="absolute z-10 border-2 border-dashed border-amber-400 rounded bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            >
              <div className="absolute -top-6 left-0 bg-amber-500 text-slate-950 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap shadow">
                <CloudFog className="w-3 h-3" />
                <span>SMOKE HAZARD {hazard.confidence.toFixed(1)}%</span>
              </div>
            </div>
          ))}

        {/* Bounding Box: Detected Workers & PPE Compliance */}
        {camera.workers.map((worker) => (
          <div
            key={worker.id}
            onClick={() => onSelectWorker && onSelectWorker(worker, camera)}
            style={{
              left: `${worker.bbox.x}%`,
              top: `${worker.bbox.y}%`,
              width: `${worker.bbox.w}%`,
              height: `${worker.bbox.h}%`,
            }}
            className={`absolute z-10 border-2 rounded cursor-pointer transition-all hover:scale-[1.02] ${
              worker.isCompliant
                ? 'border-emerald-400 bg-emerald-500/10 hover:border-emerald-300'
                : 'border-red-500 bg-red-500/15 hover:border-red-400 animate-pulse'
            }`}
            title="Click to inspect worker safety compliance"
          >
            {/* Top label with name & overall status */}
            <div
              className={`absolute -top-6 left-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap shadow ${
                worker.isCompliant ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              <span>{worker.name}</span>
              <span>·</span>
              <span>{worker.isCompliant ? 'PASS' : 'VIOLATION'}</span>
            </div>

            {/* Micro PPE gear icons inside box */}
            <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between bg-black/80 px-1.5 py-1 rounded backdrop-blur-sm text-[9px] font-mono border border-slate-700/60">
              <span
                className={`flex items-center gap-0.5 ${
                  worker.helmet.detected ? 'text-emerald-400' : 'text-red-400 font-bold'
                }`}
                title={`Helmet: ${worker.helmet.detected ? 'Detected' : 'Missing'}`}
              >
                <HardHat className="w-2.5 h-2.5" />
                {worker.helmet.detected ? '✓' : '✗'}
              </span>

              <span
                className={`flex items-center gap-0.5 ${
                  worker.vest.detected ? 'text-emerald-400' : 'text-red-400 font-bold'
                }`}
                title={`Vest: ${worker.vest.detected ? 'Detected' : 'Missing'}`}
              >
                <Shield className="w-2.5 h-2.5" />
                {worker.vest.detected ? '✓' : '✗'}
              </span>

              <span
                className={`flex items-center gap-0.5 ${
                  worker.footwear.detected ? 'text-emerald-400' : 'text-red-400 font-bold'
                }`}
                title={`Boots: ${worker.footwear.detected ? 'Detected' : 'Missing'}`}
              >
                <Footprints className="w-2.5 h-2.5" />
                {worker.footwear.detected ? '✓' : '✗'}
              </span>

              <span
                className={`flex items-center gap-0.5 ${
                  worker.gloves.detected ? 'text-emerald-400' : 'text-red-400 font-bold'
                }`}
                title={`Gloves: ${worker.gloves.detected ? 'Detected' : 'Missing'}`}
              >
                <Shield className="w-2.5 h-2.5" />
                {worker.gloves.detected ? '✓' : '✗'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Camera Live Controls & Manual Incident Simulator */}
      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSnapshot}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            title="Capture snapshot evidence"
          >
            {snapshotSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Camera className="w-3 h-3" />}
            <span>{snapshotSuccess ? 'Saved' : 'Snapshot'}</span>
          </button>

          {/* Quick Click to inspect if workers exist */}
          {camera.workers.length > 0 && onSelectWorker && (
            <button
              onClick={() => onSelectWorker(camera.workers[0], camera)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-[11px] transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Inspect PPE</span>
            </button>
          )}
        </div>

        {/* Simulation Actions to test the system according to Problem Statement 6 */}
        {onSimulateHazard && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Test Trigger:</span>
            <button
              onClick={() => onSimulateHazard(camera, 'fire')}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-red-950/60 border border-red-800 text-red-300 hover:bg-red-900 transition-colors"
              title="Trigger simulated fire event for alert dispatch verification"
            >
              +Fire
            </button>
            <button
              onClick={() => onSimulateHazard(camera, 'smoke')}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900 transition-colors"
              title="Trigger simulated smoke event for alert dispatch verification"
            >
              +Smoke
            </button>
            <button
              onClick={() => onSimulateHazard(camera, 'ppe')}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-sky-950/60 border border-sky-800 text-sky-300 hover:bg-sky-900 transition-colors"
              title="Trigger simulated PPE violation"
            >
              +PPE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
