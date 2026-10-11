import React, { useState } from 'react';
import { Search, Filter, Download, Flame, CloudFog, AlertTriangle, ShieldCheck, Eye, X, CheckCircle2, MapPin, Calendar, Clock, FileSpreadsheet } from 'lucide-react';
import { AlertItem, SeverityLevel } from '../types/safety';

interface IncidentVaultProps {
  incidents: AlertItem[];
  onResolveIncident: (incidentId: string, notes: string) => void;
  onViewCameraFeed: (cameraId: string) => void;
}

export const IncidentVault: React.FC<IncidentVaultProps> = ({
  incidents,
  onResolveIncident,
  onViewCameraFeed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedIncident, setSelectedIncident] = useState<AlertItem | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter === 'active' && inc.status === 'resolved') return false;
    if (statusFilter === 'resolved' && inc.status !== 'resolved') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inc.id.toLowerCase().includes(q) ||
      inc.title.toLowerCase().includes(q) ||
      inc.zone.toLowerCase().includes(q) ||
      inc.cameraName.toLowerCase().includes(q) ||
      (inc.workerName && inc.workerName.toLowerCase().includes(q))
    );
  });

  const handleExportCSV = () => {
    const headers = ['Incident_ID', 'Timestamp', 'Severity', 'Type', 'Zone', 'Camera', 'Status', 'Confidence', 'Description', 'Resolution_Notes'];
    const rows = filteredIncidents.map((i) => [
      i.id,
      i.timestamp,
      i.severity,
      i.type,
      `"${i.zone}"`,
      `"${i.cameraName}"`,
      i.status,
      `${i.confidence}%`,
      `"${i.description.replace(/"/g, '""')}"`,
      `"${(i.resolutionNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SafeVision_Incidents_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveResolution = () => {
    if (selectedIncident && resolutionInput.trim()) {
      onResolveIncident(selectedIncident.id, resolutionInput.trim());
      setSelectedIncident(null);
      setResolutionInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Incident Vault & Compliance Records</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of all detected safety infringements, hazard outbreaks, and forensic evidence archives.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, zone, worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded-lg border transition-colors ${
            statusFilter === 'all'
              ? 'bg-slate-800 border-amber-400 text-white font-semibold'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Incidents ({incidents.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-3 py-1 rounded-lg border transition-colors ${
            statusFilter === 'active'
              ? 'bg-slate-800 border-amber-400 text-white font-semibold'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Active / Unresolved ({incidents.filter((i) => i.status !== 'resolved').length})
        </button>
        <button
          onClick={() => setStatusFilter('resolved')}
          className={`px-3 py-1 rounded-lg border transition-colors ${
            statusFilter === 'resolved'
              ? 'bg-slate-800 border-amber-400 text-white font-semibold'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Resolved ({incidents.filter((i) => i.status === 'resolved').length})
        </button>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Severity / Type</th>
                <th className="py-3 px-4">Location & Zone</th>
                <th className="py-3 px-4">Source Camera</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No incidents match your criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {incident.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {incident.timestamp}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {incident.severity === 'critical' && (
                          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        )}
                        {incident.severity === 'high' && (
                          <CloudFog className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {incident.severity === 'medium' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-sky-400" />
                        )}
                        <span className="font-medium text-slate-200">{incident.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                      {incident.zone}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400 whitespace-nowrap">
                      {incident.cameraId}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 whitespace-nowrap">
                      {incident.confidence.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {incident.status === 'resolved' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          RESOLVED
                        </span>
                      ) : incident.status === 'investigating' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          INVESTIGATING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800 animate-pulse">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  Forensic Incident Investigation #{selectedIncident.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedIncident.title}</h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Evidence Snapshot */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
                <img
                  src={selectedIncident.snapshotUrl}
                  alt={selectedIncident.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 cctv-scanline opacity-40 pointer-events-none" />
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs font-mono text-emerald-400">
                  CAMERA: {selectedIncident.cameraName} · CONFIDENCE: {selectedIncident.confidence.toFixed(1)}%
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">FACTORY LOCATION</span>
                  <span className="text-slate-200 font-semibold">{selectedIncident.factory}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">PLANT ZONE</span>
                  <span className="text-slate-200 font-semibold truncate block">{selectedIncident.zone}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TIMESTAMP</span>
                  <span className="text-slate-200 font-semibold">{selectedIncident.timestamp}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">CURRENT STATUS</span>
                  <span className="text-amber-400 font-bold uppercase">{selectedIncident.status}</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Incident Narrative</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* Resolution Notes section */}
              {selectedIncident.status === 'resolved' ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Resolution Logged
                  </h4>
                  <p className="text-xs text-slate-300">{selectedIncident.resolutionNotes}</p>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 font-mono">
                    Log Corrective Action & Mark Incident Resolved:
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Enter root cause, equipment adjustment, or safety briefing conducted..."
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  onViewCameraFeed(selectedIncident.cameraId);
                  setSelectedIncident(null);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono hover:underline"
              >
                Jump to Live CCTV Feed →
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
                {selectedIncident.status !== 'resolved' && (
                  <button
                    onClick={handleSaveResolution}
                    disabled={!resolutionInput.trim()}
                    className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow disabled:opacity-50"
                  >
                    Resolve Incident
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
