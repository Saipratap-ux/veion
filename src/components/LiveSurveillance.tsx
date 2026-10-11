import React, { useState } from 'react';
import { LayoutGrid, Grid2X2, Grid3X3, Filter, AlertTriangle, ShieldCheck, Flame, Plus, Video } from 'lucide-react';
import { CameraFeed, DetectedWorker, AlertItem } from '../types/safety';
import { CameraView } from './CameraView';

interface LiveSurveillanceProps {
  cameras: CameraFeed[];
  activeAlerts: AlertItem[];
  onSelectWorker: (worker: DetectedWorker, camera: CameraFeed) => void;
  onSimulateHazard: (camera: CameraFeed, type: 'fire' | 'smoke' | 'ppe') => void;
  onCaptureSnapshot: (camera: CameraFeed) => void;
  onOpenAddCamera: () => void;
  onQuickViewAlert: (alert: AlertItem) => void;
}

export const LiveSurveillance: React.FC<LiveSurveillanceProps> = ({
  cameras,
  activeAlerts,
  onSelectWorker,
  onSimulateHazard,
  onCaptureSnapshot,
  onOpenAddCamera,
  onQuickViewAlert,
}) => {
  const [gridLayout, setGridLayout] = useState<'1x1' | '2x2' | '3x3'>('2x2');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [filterHazard, setFilterHazard] = useState<string>('all');
  const [focusedCameraId, setFocusedCameraId] = useState<string | null>(null);

  // Extract unique zones
  const zones = Array.from(new Set(cameras.map((c) => c.zone)));

  // Filter cameras
  const filteredCameras = cameras.filter((cam) => {
    if (selectedZone !== 'all' && cam.zone !== selectedZone) return false;
    if (filterHazard === 'hazard') {
      return cam.hazards.length > 0;
    }
    if (filterHazard === 'ppe') {
      return cam.workers.some((w) => !w.isCompliant);
    }
    if (filterHazard === 'nominal') {
      return cam.hazards.length === 0 && cam.workers.every((w) => w.isCompliant);
    }
    return true;
  });

  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical' && a.status === 'active');

  return (
    <div className="space-y-4">
      {/* Critical Hazard Alert Banner (if fire or active critical hazard is detected) */}
      {criticalAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-600/80 shadow-[0_0_25px_rgba(239,68,68,0.35)] flex flex-wrap items-center justify-between gap-3 animate-emergency">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-600 text-white animate-pulse">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                  Critical Emergency Alert
                </span>
                <span className="text-red-300 text-xs">·</span>
                <span className="text-xs font-mono text-red-200">
                  {criticalAlerts[0].factory} / {criticalAlerts[0].zone}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {criticalAlerts[0].title} on {criticalAlerts[0].cameraName}
              </h3>
            </div>
          </div>
          <button
            onClick={() => onQuickViewAlert(criticalAlerts[0])}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-red-100 hover:bg-white rounded-lg transition-colors shadow"
          >
            Investigate & Dispatch
          </button>
        </div>
      )}

      {/* Control Strip & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
        {/* Left: Operational counts */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{cameras.length} CCTV Streams Active</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{activeAlerts.filter((a) => a.status !== 'resolved').length} Active Alerts</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>94.8% PPE Compliance</span>
          </div>
        </div>

        {/* Right: Filters & Grid Layout controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zone Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">All Plant Zones</option>
              {zones.map((zone) => (
                <option key={zone} value={zone} className="bg-slate-900">
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <select
            value={filterHazard}
            onChange={(e) => setFilterHazard(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Conditions</option>
            <option value="hazard">Hazards (Fire/Smoke)</option>
            <option value="ppe">PPE Violations</option>
            <option value="nominal">Nominal Operation</option>
          </select>

          {/* Grid Layout Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => {
                setGridLayout('1x1');
                if (!focusedCameraId && filteredCameras.length > 0) {
                  setFocusedCameraId(filteredCameras[0].id);
                }
              }}
              className={`p-1.5 rounded text-xs transition-colors ${
                gridLayout === '1x1' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="1x1 Single Focus View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setGridLayout('2x2');
                setFocusedCameraId(null);
              }}
              className={`p-1.5 rounded text-xs transition-colors ${
                gridLayout === '2x2' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="2x2 Quad Grid"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setGridLayout('3x3');
                setFocusedCameraId(null);
              }}
              className={`p-1.5 rounded text-xs transition-colors ${
                gridLayout === '3x3' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="3x3 Multi Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Camera button */}
          <button
            onClick={onOpenAddCamera}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Camera</span>
          </button>
        </div>
      </div>

      {/* Camera Grid Viewports */}
      {filteredCameras.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
          <Video className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No cameras match filter</h4>
          <p className="text-xs text-slate-500 mt-1">Try switching plant zone or resetting condition filters.</p>
          <button
            onClick={() => {
              setSelectedZone('all');
              setFilterHazard('all');
            }}
            className="mt-3 px-3 py-1.5 text-xs text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10"
          >
            Reset Filters
          </button>
        </div>
      ) : gridLayout === '1x1' && focusedCameraId ? (
        <div className="space-y-3">
          {/* Quick camera switch bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            {filteredCameras.map((c) => (
              <button
                key={c.id}
                onClick={() => setFocusedCameraId(c.id)}
                className={`px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
                  c.id === focusedCameraId
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>

          {/* Large single camera */}
          {(() => {
            const cam = filteredCameras.find((c) => c.id === focusedCameraId) || filteredCameras[0];
            return (
              <CameraView
                key={cam.id}
                camera={cam}
                isExpanded={true}
                onToggleExpand={() => setGridLayout('2x2')}
                onSelectWorker={onSelectWorker}
                onSimulateHazard={onSimulateHazard}
                onCaptureSnapshot={onCaptureSnapshot}
              />
            );
          })()}
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            gridLayout === '3x3'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 lg:grid-cols-2'
          }`}
        >
          {filteredCameras.map((camera) => (
            <CameraView
              key={camera.id}
              camera={camera}
              onToggleExpand={() => {
                setFocusedCameraId(camera.id);
                setGridLayout('1x1');
              }}
              onSelectWorker={onSelectWorker}
              onSimulateHazard={onSimulateHazard}
              onCaptureSnapshot={onCaptureSnapshot}
            />
          ))}
        </div>
      )}
    </div>
  );
};
