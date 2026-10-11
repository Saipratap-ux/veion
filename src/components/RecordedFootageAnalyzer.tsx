import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, RotateCcw, AlertTriangle, Flame, CloudFog, CheckCircle2, Shield, HardHat, FileText, Download } from 'lucide-react';
import { imgFactoryFloor, imgSmokeHazard, imgFireIncident, imgPPEInspection } from '../utils/mockData';

interface FootageEvent {
  id: string;
  timeSec: number;
  timeFormatted: string;
  type: 'ppe_violation' | 'smoke' | 'fire' | 'compliance_pass';
  title: string;
  description: string;
  confidence: number;
  snapshot: string;
  equipmentStatus?: {
    helmet: boolean;
    vest: boolean;
    footwear: boolean;
    gloves: boolean;
  };
}

const SAMPLE_REELS = [
  {
    id: 'reel-1',
    title: 'Plant-A Assembly Shift Review (CAM-014)',
    duration: 180,
    poster: imgPPEInspection,
    eventsCount: 3,
    description: 'High-density welding and robotics floor recorded during shift handoff.',
  },
  {
    id: 'reel-2',
    title: 'Warehouse Logistics Storage Bay (CAM-009)',
    duration: 240,
    poster: imgSmokeHazard,
    eventsCount: 2,
    description: 'Aisle 4 junction box monitoring recorded after power surge event.',
  },
  {
    id: 'reel-3',
    title: 'Chemical Solvent Vault Incident Reel (CAM-012)',
    duration: 120,
    poster: imgFireIncident,
    eventsCount: 2,
    description: 'Emergency thermal event verification recorded during solvent transfer.',
  },
];

const PRESET_EVENTS: Record<string, FootageEvent[]> = {
  'reel-1': [
    {
      id: 'EV-101',
      timeSec: 14,
      timeFormatted: '00:00:14',
      type: 'compliance_pass',
      title: 'Worker Compliant Entrance',
      description: 'Worker Elena Rostova entered cell with complete PPE kit (Helmet, Vest, Footwear, Gloves).',
      confidence: 97.5,
      snapshot: imgPPEInspection,
      equipmentStatus: { helmet: true, vest: true, footwear: true, gloves: true },
    },
    {
      id: 'EV-102',
      timeSec: 42,
      timeFormatted: '00:00:42',
      type: 'ppe_violation',
      title: 'PPE Violation: Unprotected Hands',
      description: 'Technician Marcus Vance handling sheet metal without safety gloves.',
      confidence: 91.8,
      snapshot: imgPPEInspection,
      equipmentStatus: { helmet: true, vest: true, footwear: true, gloves: false },
    },
    {
      id: 'EV-103',
      timeSec: 110,
      timeFormatted: '00:01:50',
      type: 'ppe_violation',
      title: 'PPE Violation: Hardhat Removed',
      description: 'Worker unclasped helmet in overhead hoist crane zone.',
      confidence: 94.2,
      snapshot: imgFactoryFloor,
      equipmentStatus: { helmet: false, vest: true, footwear: true, gloves: true },
    },
  ],
  'reel-2': [
    {
      id: 'EV-201',
      timeSec: 35,
      timeFormatted: '00:00:35',
      type: 'compliance_pass',
      title: 'Forklift Operator Compliance',
      description: 'Operator David Chen verified with full reflective Class 2 vest and steel-toe boots.',
      confidence: 98.0,
      snapshot: imgSmokeHazard,
      equipmentStatus: { helmet: true, vest: true, footwear: true, gloves: true },
    },
    {
      id: 'EV-202',
      timeSec: 88,
      timeFormatted: '00:01:28',
      type: 'smoke',
      title: 'Visual Smoke Plume Inception',
      description: 'Persistent optical smoke plume detected near electrical panel junction 12.',
      confidence: 92.4,
      snapshot: imgSmokeHazard,
    },
  ],
  'reel-3': [
    {
      id: 'EV-301',
      timeSec: 25,
      timeFormatted: '00:00:25',
      type: 'smoke',
      title: 'Vapor Outgassing / Smoke',
      description: 'Pre-ignition chemical vapor plume identified by gradient fluctuation.',
      confidence: 89.6,
      snapshot: imgSmokeHazard,
    },
    {
      id: 'EV-302',
      timeSec: 64,
      timeFormatted: '00:01:04',
      type: 'fire',
      title: 'Thermal Flame Outbreak',
      description: 'Localized open flame identified near solvent drum pallet 4B.',
      confidence: 96.8,
      snapshot: imgFireIncident,
    },
  ],
};

export const RecordedFootageAnalyzer: React.FC = () => {
  const [selectedReelId, setSelectedReelId] = useState<string>('reel-1');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [analyzingFile, setAnalyzingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeReel = SAMPLE_REELS.find((r) => r.id === selectedReelId) || SAMPLE_REELS[0];
  const events = PRESET_EVENTS[selectedReelId] || [];

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeReel.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeReel.duration]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnalyzingFile(true);
      setUploadFileName(file.name);
      setTimeout(() => {
        setAnalyzingFile(false);
        setSelectedReelId('reel-1');
        setCurrentTime(0);
      }, 1500);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find active event at current scrubber time
  const currentActiveEvent = events.find(
    (ev) => currentTime >= ev.timeSec && currentTime <= ev.timeSec + 15
  );

  const exportTimeline = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Event_ID,Timestamp,Type,Confidence,Title,Description\n' +
      events
        .map(
          (e) =>
            `"${e.id}","${e.timeFormatted}","${e.type}","${e.confidence}%","${e.title}","${e.description.replace(/"/g, '""')}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SafeVision_Footage_Analysis_${selectedReelId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Reel Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Recorded Footage AI Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Process past CCTV recordings and shift archives to reconstruct incident timelines and identify unlogged violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload Trigger */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzingFile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{analyzingFile ? 'Analyzing Frames...' : 'Upload Video File'}</span>
          </button>

          <button
            onClick={exportTimeline}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {uploadFileName && (
        <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-800 text-xs text-sky-200 flex items-center justify-between">
          <span>Processed footage: <strong>{uploadFileName}</strong> — 3 AI detection events tagged along timeline.</span>
          <button onClick={() => setUploadFileName(null)} className="text-sky-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Preset Reel Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_REELS.map((reel) => (
          <button
            key={reel.id}
            onClick={() => {
              setSelectedReelId(reel.id);
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedReelId === reel.id
                ? 'bg-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-amber-400 truncate">{reel.title}</span>
              <span className="text-slate-400">{formatSeconds(reel.duration)}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{reel.description}</p>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span>{reel.eventsCount} AI Incident Markers</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Video Player & Detection Canvas */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="relative aspect-video w-full max-h-[500px] overflow-hidden bg-black select-none">
          <img
            src={activeReel.poster}
            alt={activeReel.title}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 cctv-scanline opacity-50 pointer-events-none" />

          {/* OSD Time overlay */}
          <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>PLAYBACK: {formatSeconds(currentTime)} / {formatSeconds(activeReel.duration)}</span>
          </div>

          {/* Active AI Detection Event Overlay during playback */}
          {currentActiveEvent && (
            <div className="absolute top-3 right-3 max-w-sm p-3 rounded-xl bg-slate-950/95 border border-amber-500/80 shadow-2xl backdrop-blur-md animate-in fade-in">
              <div className="flex items-center gap-2">
                {currentActiveEvent.type === 'fire' && <Flame className="w-4 h-4 text-red-500 fill-red-500" />}
                {currentActiveEvent.type === 'smoke' && <CloudFog className="w-4 h-4 text-amber-400" />}
                {currentActiveEvent.type === 'ppe_violation' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {currentActiveEvent.type === 'compliance_pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span className="font-mono text-xs font-bold text-white uppercase">
                  {currentActiveEvent.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{currentActiveEvent.description}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <span className="text-slate-400">Timestamp: {currentActiveEvent.timeFormatted}</span>
                <span className="text-amber-400 font-bold">Conf: {currentActiveEvent.confidence}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          {/* Annotated Scrubber Bar */}
          <div className="relative">
            {/* Timeline track */}
            <input
              type="range"
              min={0}
              max={activeReel.duration}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            {/* Event Markers on Timeline */}
            {events.map((ev) => {
              const leftPercent = (ev.timeSec / activeReel.duration) * 100;
              return (
                <div
                  key={ev.id}
                  onClick={() => handleSeek(ev.timeSec)}
                  style={{ left: `${leftPercent}%` }}
                  className={`absolute top-0 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-slate-900 cursor-pointer shadow transition-transform hover:scale-125 ${
                    ev.type === 'fire'
                      ? 'bg-red-500'
                      : ev.type === 'smoke'
                      ? 'bg-amber-400'
                      : ev.type === 'ppe_violation'
                      ? 'bg-yellow-400'
                      : 'bg-emerald-400'
                  }`}
                  title={`${ev.timeFormatted}: ${ev.title}`}
                />
              );
            })}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset to 00:00"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-slate-300 ml-2">
                {formatSeconds(currentTime)} / {formatSeconds(activeReel.duration)}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Fire</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Smoke</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span>PPE Violation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Analysis Event Log Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Reconstructed Incident Log ({events.length} events detected)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Temporal Verification Active</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => handleSeek(ev.timeSec)}
              className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                currentTime >= ev.timeSec && currentTime <= ev.timeSec + 15
                  ? 'bg-slate-800/80 border-l-4 border-amber-400'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {ev.timeFormatted}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{ev.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <span className="text-slate-400">Confidence: <strong className="text-white">{ev.confidence}%</strong></span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(ev.timeSec);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                >
                  Jump to Frame
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
