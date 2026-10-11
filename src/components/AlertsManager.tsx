import React, { useState } from 'react';
import { Flame, CloudFog, AlertTriangle, ShieldCheck, Check, Clock, MapPin, Send, ExternalLink, Filter } from 'lucide-react';
import { AlertItem, SeverityLevel } from '../types/safety';

interface AlertsManagerProps {
  alerts: AlertItem[];
  userRole: string;
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string, notes: string) => void;
  onViewCameraStream: (cameraId: string) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  alerts,
  userRole,
  onAcknowledgeAlert,
  onResolveAlert,
  onViewCameraStream,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity === 'all') return true;
    if (selectedSeverity === 'active') return alert.status !== 'resolved';
    if (selectedSeverity === 'resolved') return alert.status === 'resolved';
    return alert.severity === selectedSeverity;
  });

  const handleStartResolve = (alert: AlertItem) => {
    setResolvingAlertId(alert.id);
    setResolutionNotes(`Issue investigated on-site by ${userRole}. Safety protocol verified and floor cleared.`);
  };

  const handleConfirmResolve = (alertId: string) => {
    onResolveAlert(alertId, resolutionNotes);
    setResolvingAlertId(null);
    setResolutionNotes('');
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-red-400 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded">
            <Flame className="w-3 h-3 fill-red-400" /> CRITICAL HAZARD
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
            <CloudFog className="w-3 h-3" /> HIGH SMOKE WARNING
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-sky-400 bg-sky-950/80 border border-sky-800 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" /> PPE NON-COMPLIANCE
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and status tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Central Safety Alert Queue</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time contextual hazard warnings with geographic factory coordinates and intervention workflow.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              selectedSeverity === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('active')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              selectedSeverity === 'active' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({alerts.filter((a) => a.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              selectedSeverity === 'critical' ? 'bg-red-900/40 text-red-300 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setSelectedSeverity('resolved')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              selectedSeverity === 'resolved' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({alerts.filter((a) => a.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Alert List Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="py-16 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">No matching alerts in queue</p>
            <p className="text-xs text-slate-500 mt-1">All safety conditions currently nominal within selected filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.status === 'resolved'
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                  : alert.severity === 'critical'
                  ? 'bg-red-950/30 border-red-600/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : alert.severity === 'high'
                  ? 'bg-amber-950/30 border-amber-600/60'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left: Snapshot + details */}
                <div className="flex items-start gap-4">
                  {/* Evidence Snapshot */}
                  <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                    <img
                      src={alert.snapshotUrl}
                      alt={alert.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 cctv-scanline opacity-40" />
                  </div>

                  {/* Text details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{alert.id}</span>
                      <span className="text-slate-600">·</span>
                      {getSeverityBadge(alert.severity)}
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                    <p className="text-xs text-slate-300 max-w-2xl">{alert.description}</p>

                    {/* Location Breadcrumb & Camera Anchor */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{alert.factory} &gt; {alert.building} &gt; {alert.zone}</span>
                      </div>
                      <span className="text-slate-600">·</span>
                      <button
                        onClick={() => onViewCameraStream(alert.cameraId)}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Source: {alert.cameraName}</span>
                      </button>
                      <span className="text-slate-600">·</span>
                      <span className="text-emerald-400">AI Confidence: {alert.confidence.toFixed(1)}%</span>
                    </div>

                    {/* Acknowledged or resolved footer notes */}
                    {alert.acknowledgedBy && (
                      <p className="text-[11px] text-slate-400 pt-1">
                        Acknowledged by: <strong className="text-slate-200">{alert.acknowledgedBy}</strong> ({alert.acknowledgedAt})
                      </p>
                    )}
                    {alert.resolvedAt && (
                      <p className="text-[11px] text-emerald-400 pt-1">
                        Resolved ({alert.resolvedAt}): {alert.resolutionNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Operational Actions */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge Alert</span>
                      </button>
                      <button
                        onClick={() => handleStartResolve(alert)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
                      >
                        Dispatch & Resolve
                      </button>
                    </>
                  )}

                  {alert.status === 'investigating' && (
                    <button
                      onClick={() => handleStartResolve(alert)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete Resolution</span>
                    </button>
                  )}

                  {alert.status === 'resolved' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-semibold py-1">
                      <ShieldCheck className="w-4 h-4" /> RESOLVED
                    </span>
                  )}
                </div>
              </div>

              {/* Resolution Notes Modal/Input Drawer */}
              {resolvingAlertId === alert.id && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-950/80 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Incident Resolution Record · {alert.id}
                    </span>
                    <button
                      onClick={() => setResolvingAlertId(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={2}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                    placeholder="Document root cause, corrective intervention, and equipment replacement..."
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setResolvingAlertId(null)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleConfirmResolve(alert.id)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Save & Close Incident</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
