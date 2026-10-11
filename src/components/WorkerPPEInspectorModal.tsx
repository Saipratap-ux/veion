import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Send, Bell, HardHat, Shield, Footprints } from 'lucide-react';
import { DetectedWorker, CameraFeed } from '../types/safety';

interface WorkerPPEInspectorModalProps {
  worker: DetectedWorker | null;
  camera: CameraFeed | null;
  onClose: () => void;
  onIssueWarning: (worker: DetectedWorker, camera: CameraFeed, note: string) => void;
}

export const WorkerPPEInspectorModal: React.FC<WorkerPPEInspectorModalProps> = ({
  worker,
  camera,
  onClose,
  onIssueWarning,
}) => {
  const [warningNote, setWarningNote] = useState('Safety compliance reminder: Mandatory PPE must be secured prior to machinery operation.');
  const [dispatched, setDispatched] = useState(false);

  if (!worker || !camera) return null;

  const handleSend = () => {
    onIssueWarning(worker, camera, warningNote);
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Worker PPE Inspector</span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-400">{camera.name}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{worker.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Worker summary & compliance banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Assigned Role</p>
              <p className="text-sm font-semibold text-slate-200">{worker.role}</p>
              <p className="text-xs text-slate-500 mt-0.5">{camera.zone} · {camera.building}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Compliance Status</p>
              {worker.isCompliant ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> 100% Compliant
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" /> Non-Compliant ({worker.violations.length} missing)
                </span>
              )}
            </div>
          </div>

          {/* 4 Required PPE Categories from Problem Statement 6 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mandatory Gear Verification Check
            </h4>

            {/* 1. Safety Helmet */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${worker.helmet.detected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Industrial Safety Helmet</p>
                  <p className="text-[11px] text-slate-400">Impact & electrical shock resistant head protection</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-semibold ${worker.helmet.detected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {worker.helmet.detected ? `DETECTED (${worker.helmet.confidence}%)` : `MISSING (${worker.helmet.confidence}%)`}
                </span>
              </div>
            </div>

            {/* 2. High-Visibility Vest */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${worker.vest.detected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">High-Visibility Safety Vest</p>
                  <p className="text-[11px] text-slate-400">ANSI/ISEA 107 Class 2 reflective day/night</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-semibold ${worker.vest.detected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {worker.vest.detected ? `DETECTED (${worker.vest.confidence}%)` : `MISSING (${worker.vest.confidence}%)`}
                </span>
              </div>
            </div>

            {/* 3. Protective Footwear */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${worker.footwear.detected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Protective Footwear (Steel-Toe Boots)</p>
                  <p className="text-[11px] text-slate-400">ASTM F2413 crush & puncture safety sole</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-semibold ${worker.footwear.detected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {worker.footwear.detected ? `DETECTED (${worker.footwear.confidence}%)` : `MISSING (${worker.footwear.confidence}%)`}
                </span>
              </div>
            </div>

            {/* 4. Safety Gloves */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${worker.gloves.detected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Protective Industrial Gloves</p>
                  <p className="text-[11px] text-slate-400">EN388 mechanical cut & thermal barrier</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-semibold ${worker.gloves.detected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {worker.gloves.detected ? `DETECTED (${worker.gloves.confidence}%)` : `MISSING (${worker.gloves.confidence}%)`}
                </span>
              </div>
            </div>
          </div>

          {/* Action form */}
          {!worker.isCompliant && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Immediate Floor Dispatch Warning</span>
                <span className="text-[11px] text-slate-500 font-mono">Audio chime + pager</span>
              </label>
              <textarea
                value={warningNote}
                onChange={(e) => setWarningNote(e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          
          <div className="flex items-center gap-2">
            {!worker.isCompliant ? (
              <button
                disabled={dispatched}
                onClick={handleSend}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {dispatched ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>Warning Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Warning to Floor</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Acknowledge Compliant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
