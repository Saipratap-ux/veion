import React, { useState } from 'react';
import { Video, Plus, Check, Settings2, Sliders, RefreshCw, X, ShieldAlert, AlertTriangle, Eye, Flame, CloudFog } from 'lucide-react';
import { CameraFeed } from '../types/safety';

interface CameraFleetManagerProps {
  cameras: CameraFeed[];
  onAddCamera: (newCamera: CameraFeed) => void;
  onUpdateCamera: (updatedCamera: CameraFeed) => void;
  onViewFeed: (cameraId: string) => void;
}

export const CameraFleetManager: React.FC<CameraFleetManagerProps> = ({
  cameras,
  onAddCamera,
  onUpdateCamera,
  onViewFeed,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCamForConfig, setSelectedCamForConfig] = useState<CameraFeed | null>(null);

  // New Camera Form State
  const [newCamId, setNewCamId] = useState(`CAM-0${cameras.length + 15}`);
  const [newCamName, setNewCamName] = useState('');
  const [newCamZone, setNewCamZone] = useState('Production Line Alpha');
  const [newCamBuilding, setNewCamBuilding] = useState('Building A (Assembly)');
  const [newCamUrl, setNewCamUrl] = useState('rtsp://stream.gigafab.internal/cam');
  const [enablePPE, setEnablePPE] = useState(true);
  const [enableSmoke, setEnableSmoke] = useState(true);
  const [enableFire, setEnableFire] = useState(true);
  const [threshold, setThreshold] = useState(75);

  const handleCreateCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName.trim()) return;

    // Pick one of the generated images as poster
    const poster = cameras[0].imagePoster;

    const newFeed: CameraFeed = {
      id: newCamId,
      name: `${newCamId} (${newCamName})`,
      factory: 'GigaFab 01',
      building: newCamBuilding,
      zone: newCamZone,
      streamUrl: newCamUrl,
      imagePoster: poster,
      status: 'online',
      fps: 30,
      bitrate: '4.5 Mbps',
      resolution: '1920x1080',
      enabled: true,
      ppeModelEnabled: enablePPE,
      smokeModelEnabled: enableSmoke,
      fireModelEnabled: enableFire,
      confidenceThreshold: threshold,
      workers: [
        {
          id: `w-${Date.now()}`,
          name: 'Floor Operator',
          role: 'Technician',
          bbox: { x: 30, y: 30, w: 25, h: 60 },
          helmet: { detected: true, confidence: 96 },
          vest: { detected: true, confidence: 95 },
          footwear: { detected: true, confidence: 92 },
          gloves: { detected: true, confidence: 90 },
          isCompliant: true,
          violations: [],
        },
      ],
      hazards: [],
    };

    onAddCamera(newFeed);
    setIsAddModalOpen(false);
    setNewCamName('');
    setNewCamId(`CAM-0${cameras.length + 16}`);
  };

  const handleTogglePPE = (cam: CameraFeed) => {
    onUpdateCamera({ ...cam, ppeModelEnabled: !cam.ppeModelEnabled });
  };

  const handleToggleSmoke = (cam: CameraFeed) => {
    onUpdateCamera({ ...cam, smokeModelEnabled: !cam.smokeModelEnabled });
  };

  const handleToggleFire = (cam: CameraFeed) => {
    onUpdateCamera({ ...cam, fireModelEnabled: !cam.fireModelEnabled });
  };

  return (
    <div className="space-y-4">
      {/* Header and Add Camera Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Camera Fleet Infrastructure</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure CCTV stream gateways, neural edge inference models, and confidence thresholds per zone.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Connect New CCTV Stream</span>
        </button>
      </div>

      {/* Camera Health & Configuration Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Camera ID & Label</th>
                <th className="py-3 px-4">Zone Assignment</th>
                <th className="py-3 px-4">Resolution & FPS</th>
                <th className="py-3 px-4">Stream Status</th>
                <th className="py-3 px-4">AI PPE Model</th>
                <th className="py-3 px-4">Smoke AI</th>
                <th className="py-3 px-4">Fire AI</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {cameras.map((camera) => (
                <tr key={camera.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white">{camera.id}</div>
                    <div className="text-[11px] text-slate-400">{camera.name}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                    <div>{camera.zone}</div>
                    <div className="text-slate-500 text-[10px]">{camera.building}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    <div>{camera.resolution}</div>
                    <div className="text-slate-500">{camera.fps} FPS · {camera.bitrate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </td>
                  {/* PPE Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePPE(camera)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border transition-colors ${
                        camera.ppeModelEnabled
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {camera.ppeModelEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </td>
                  {/* Smoke Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleSmoke(camera)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border transition-colors ${
                        camera.smokeModelEnabled
                          ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {camera.smokeModelEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </td>
                  {/* Fire Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFire(camera)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border transition-colors ${
                        camera.fireModelEnabled
                          ? 'bg-red-950/80 border-red-700 text-red-400'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {camera.fireModelEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-300">
                    {camera.confidenceThreshold}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewFeed(camera.id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View CCTV Stream"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedCamForConfig(camera)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Configure AI Parameters"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-base font-bold text-white">Connect New CCTV Camera</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCamera} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 font-mono">Camera ID</label>
                  <input
                    type="text"
                    required
                    value={newCamId}
                    onChange={(e) => setNewCamId(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 font-mono">Location Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Battery Testing Cell 2"
                    value={newCamName}
                    onChange={(e) => setNewCamName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 font-mono">Stream Protocol & URL</label>
                <input
                  type="text"
                  required
                  value={newCamUrl}
                  onChange={(e) => setNewCamUrl(e.target.value)}
                  placeholder="rtsp://192.168.1.120:554/live/ch0"
                  className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 font-mono">Plant Zone</label>
                  <select
                    value={newCamZone}
                    onChange={(e) => setNewCamZone(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                  >
                    <option value="Production Line Alpha">Production Line Alpha</option>
                    <option value="Logistics & Raw Materials Bay">Logistics & Raw Materials Bay</option>
                    <option value="Solvent & Chemical Vault">Solvent & Chemical Vault</option>
                    <option value="Robotic Fabrication & Welding">Robotic Fabrication & Welding</option>
                    <option value="High-Voltage Switchgear Substation">High-Voltage Substation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 font-mono">Factory Building</label>
                  <input
                    type="text"
                    value={newCamBuilding}
                    onChange={(e) => setNewCamBuilding(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                  />
                </div>
              </div>

              {/* AI Models checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 font-mono">Enable Neural Detection Models:</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enablePPE}
                      onChange={(e) => setEnablePPE(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span>PPE Check</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableSmoke}
                      onChange={(e) => setEnableSmoke(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span>Smoke AI</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableFire}
                      onChange={(e) => setEnableFire(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span>Fire AI</span>
                  </label>
                </div>
              </div>

              {/* Threshold Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Confidence Threshold</span>
                  <span className="text-amber-400 font-bold">{threshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow"
                >
                  Provision Camera Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Config threshold modal for existing camera */}
      {selectedCamForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">AI Detection Configuration · {selectedCamForConfig.id}</h3>
              <button onClick={() => setSelectedCamForConfig(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Confidence Filter Threshold: {selectedCamForConfig.confidenceThreshold}%</label>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={selectedCamForConfig.confidenceThreshold}
                  onChange={(e) =>
                    onUpdateCamera({
                      ...selectedCamForConfig,
                      confidenceThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCamForConfig(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
