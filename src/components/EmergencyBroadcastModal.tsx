import React, { useState } from 'react';
import { ShieldAlert, Flame, Volume2, X, Send, AlertTriangle } from 'lucide-react';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (type: 'evacuate' | 'fire_drill' | 'ppe_stand_down', message: string) => void;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [broadcastType, setBroadcastType] = useState<'evacuate' | 'fire_drill' | 'ppe_stand_down'>('evacuate');
  const [message, setMessage] = useState('ATTENTION ALL PERSONNEL: Thermal hazard verified in Building C. Evacuate immediately via designated primary pathways.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcast(broadcastType, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-red-600/80 shadow-[0_0_30px_rgba(239,68,68,0.4)] overflow-hidden">
        <div className="px-6 py-4 bg-red-950/80 border-b border-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600 text-white animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-300">
                Command Override
              </span>
              <h3 className="text-base font-bold text-white">Facility-Wide Emergency Broadcast</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-red-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono">Select Protocol Level</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBroadcastType('evacuate');
                  setMessage('CRITICAL: Hazardous thermal flame detected. Evacuate Plant Building C immediately to Assembly Point A.');
                }}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                  broadcastType === 'evacuate'
                    ? 'bg-red-600 border-red-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Immediate Evacuation
              </button>
              <button
                type="button"
                onClick={() => {
                  setBroadcastType('fire_drill');
                  setMessage('FACILITY ALERT: Scheduled industrial fire safety drill commencing. Supervisors report muster count.');
                }}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                  broadcastType === 'fire_drill'
                    ? 'bg-amber-600 border-amber-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Fire Drill
              </button>
              <button
                type="button"
                onClick={() => {
                  setBroadcastType('ppe_stand_down');
                  setMessage('COMPLIANCE NOTICE: Plant safety stand-down. All floor personnel conduct 5-point PPE inspection.');
                }}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                  broadcastType === 'ppe_stand_down'
                    ? 'bg-sky-600 border-sky-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                PPE Stand-Down
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 font-mono">Broadcast Message Announcement</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:border-red-400 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>This broadcast triggers synthesized floor acoustic alarms and pushes push notifications to all supervisor tablets.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Emergency Alarm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
