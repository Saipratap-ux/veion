import React, { useState } from 'react';
import { MapPin, Users, Shield, AlertTriangle, Flame, HardHat, Footprints, Video, Plus, Check } from 'lucide-react';
import { FactoryZone, CameraFeed } from '../types/safety';

interface PlantZonesViewProps {
  zones: FactoryZone[];
  cameras: CameraFeed[];
  onSelectZone: (zoneName: string) => void;
  onUpdateZone: (updatedZone: FactoryZone) => void;
}

export const PlantZonesView: React.FC<PlantZonesViewProps> = ({
  zones,
  cameras,
  onSelectZone,
  onUpdateZone,
}) => {
  const [editingZone, setEditingZone] = useState<FactoryZone | null>(null);

  const getCameraCountForZone = (zoneName: string) => {
    return cameras.filter((c) => c.zone === zoneName).length;
  };

  const handleTogglePPE = (ppeType: 'helmet' | 'vest' | 'footwear' | 'gloves') => {
    if (!editingZone) return;
    const exists = editingZone.mandatoryPPE.includes(ppeType);
    const updated = exists
      ? editingZone.mandatoryPPE.filter((p) => p !== ppeType)
      : [...editingZone.mandatoryPPE, ppeType];
    setEditingZone({ ...editingZone, mandatoryPPE: updated });
  };

  const handleSavePolicy = () => {
    if (editingZone) {
      onUpdateZone(editingZone);
      setEditingZone(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Facility Spatial Zones & Safety Boundaries</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic segmentation enables automated alert contextualization, routing, and floor supervisor notification.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> 4 Nominal
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> 1 Elevated
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" /> 1 Critical
          </span>
        </div>
      </div>

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const camCount = getCameraCountForZone(zone.name);
          return (
            <div
              key={zone.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all bg-slate-950 ${
                zone.riskLevel === 'critical'
                  ? 'border-red-600/80 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : zone.riskLevel === 'elevated'
                  ? 'border-amber-600/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {zone.building}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{zone.name}</h3>
                  </div>

                  {zone.riskLevel === 'critical' ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800 animate-pulse">
                      <Flame className="w-3 h-3 fill-red-400" /> CRITICAL
                    </span>
                  ) : zone.riskLevel === 'elevated' ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      <AlertTriangle className="w-3 h-3" /> ELEVATED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      NOMINAL
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-900 font-mono text-center">
                  <div className="p-2 rounded bg-slate-900/50">
                    <span className="text-[10px] text-slate-500 block">WORKERS</span>
                    <span className="text-sm font-bold text-slate-200">{zone.activeWorkers}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/50">
                    <span className="text-[10px] text-slate-500 block">CAMERAS</span>
                    <span className="text-sm font-bold text-amber-400">{camCount}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/50">
                    <span className="text-[10px] text-slate-500 block">COMPLIANCE</span>
                    <span
                      className={`text-sm font-bold ${
                        zone.ppeComplianceRate >= 95 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {zone.ppeComplianceRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Mandatory PPE Requirements */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">
                    Mandatory Zone Gear Policy
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {zone.mandatoryPPE.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center gap-1"
                      >
                        {item === 'helmet' && <HardHat className="w-3 h-3 text-amber-400" />}
                        {item === 'vest' && <Shield className="w-3 h-3 text-sky-400" />}
                        {item === 'footwear' && <Footprints className="w-3 h-3 text-emerald-400" />}
                        {item === 'gloves' && <Shield className="w-3 h-3 text-amber-400" />}
                        <span className="capitalize">{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between gap-2">
                <button
                  onClick={() => setEditingZone(zone)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white border border-slate-800 rounded hover:border-slate-700 transition-colors"
                >
                  Configure Policy
                </button>
                <button
                  onClick={() => onSelectZone(zone.name)}
                  className="px-3 py-1 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>View Feeds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Zone Policy Modal */}
      {editingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Zone Safety Gear Requirements</h3>
                <p className="text-xs text-slate-400">{editingZone.name}</p>
              </div>
              <button onClick={() => setEditingZone(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-mono text-slate-300">Enforce Mandatory Detection For:</span>
              {(['helmet', 'vest', 'footwear', 'gloves'] as const).map((ppe) => {
                const active = editingZone.mandatoryPPE.includes(ppe);
                return (
                  <button
                    key={ppe}
                    onClick={() => handleTogglePPE(ppe)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-colors ${
                      active
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="capitalize">{ppe}</span>
                    <span className="font-mono text-[11px] font-bold">{active ? 'REQUIRED ✓' : 'OPTIONAL'}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingZone(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePolicy}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
              >
                Save Zone Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
