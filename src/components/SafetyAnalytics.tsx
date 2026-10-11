import React, { useState } from 'react';
import { TrendingUp, ShieldAlert, Award, Clock, Flame, CloudFog, HardHat, Shield, Footprints, AlertTriangle } from 'lucide-react';
import { FactoryZone, AlertItem } from '../types/safety';

interface SafetyAnalyticsProps {
  zones: FactoryZone[];
  alerts: AlertItem[];
}

export const SafetyAnalytics: React.FC<SafetyAnalyticsProps> = ({ zones, alerts }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalViolations = alerts.filter((a) => a.type === 'ppe_violation').length;
  const fireEvents = alerts.filter((a) => a.type === 'fire_detected').length;
  const smokeEvents = alerts.filter((a) => a.type === 'smoke_detected').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  // 7-day trend data
  const trendDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const compliancePoints = [91.2, 92.5, 93.8, 92.0, 94.4, 95.1, 94.8];

  return (
    <div className="space-y-5">
      {/* Top Banner & KPI metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Industrial Safety & Compliance Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantitative telemetry derived from edge CCTV computer vision inference streams.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              timeRange === '7d' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              timeRange === '30d' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              timeRange === '90d' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Compliance */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">PLANT PPE COMPLIANCE</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">94.8%</span>
            <span className="text-xs font-mono text-emerald-400/80">▲ +1.6%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target threshold: ≥ 92.0%</p>
        </div>

        {/* Mean Time to Acknowledge */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">AVG ACK TIME (MTTA)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">28s</span>
            <span className="text-xs font-mono text-emerald-400">▼ -12s vs avg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Goal: &lt; 45 seconds</p>
        </div>

        {/* Fire & Smoke Detections */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">HAZARD INCIDENTS</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-400">{fireEvents + smokeEvents}</span>
            <span className="text-xs font-mono text-slate-400">({fireEvents} Fire · {smokeEvents} Smoke)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">All verified via optical AI</p>
        </div>

        {/* Resolution Rate */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">INCIDENT RESOLUTION</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-sky-400">
              {alerts.length ? Math.round((resolvedCount / alerts.length) * 100) : 100}%
            </span>
            <span className="text-xs font-mono text-slate-400">{resolvedCount}/{alerts.length} Closed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Average MTTR: 3.4 mins</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Chart: 7-Day Compliance Curve */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Daily PPE Compliance Trajectory</h3>
              <p className="text-xs text-slate-400">Aggregated worker gear compliance rate across 24 surveillance streams</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Positive Safety Trend</span>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-52 w-full pt-4">
            <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="700" y2="130" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Y Axis Labels */}
              <text x="5" y="26" fill="#64748b" fontSize="10" fontFamily="monospace">98%</text>
              <text x="5" y="76" fill="#64748b" fontSize="10" fontFamily="monospace">94%</text>
              <text x="5" y="126" fill="#64748b" fontSize="10" fontFamily="monospace">90%</text>

              {/* Polygon Fill */}
              <polygon
                points="40,160 40,118 140,94 240,68 340,102 440,56 540,42 640,48 640,160"
                fill="url(#chartGradient)"
              />

              {/* Polyline Path */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points="40,118 140,94 240,68 340,102 440,56 540,42 640,48"
              />

              {/* Data Dots & X Axis Labels */}
              {trendDays.map((day, idx) => {
                const x = 40 + idx * 100;
                const ys = [118, 94, 68, 102, 56, 42, 48];
                const y = ys[idx];
                const score = compliancePoints[idx];

                return (
                  <g key={day}>
                    <circle cx={x} cy={y} r="5" fill="#090d16" stroke="#10b981" strokeWidth="2.5" />
                    <text x={x} y={y - 10} fill="#f1f5f9" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {score}%
                    </text>
                    <text x={x} y="175" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                      {day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Violations Distribution by Equipment (The 4 classes from Problem Statement 6) */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Violations by Equipment Class</h3>
            <p className="text-xs text-slate-400">Distribution across 4 required safety gear categories</p>
          </div>

          <div className="space-y-3 pt-2">
            {/* 1. Gloves */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Protective Gloves</span>
                </span>
                <span className="font-mono font-bold text-amber-400">42% (18 events)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            {/* 2. Hardhat / Helmet */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <HardHat className="w-3.5 h-3.5 text-red-400" />
                  <span>Safety Helmet</span>
                </span>
                <span className="font-mono font-bold text-red-400">28% (12 events)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-400 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            {/* 3. High-Vis Vest */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Reflective Vest</span>
                </span>
                <span className="font-mono font-bold text-sky-400">18% (8 events)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            {/* 4. Protective Footwear */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Safety Footwear</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">12% (5 events)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200">
            <strong>Actionable Recommendation:</strong> High hand injury hazard in Robotic Welding Bay. Schedule glove inventory dispenser restocking at Station 3.
          </div>
        </div>
      </div>

      {/* Zone-by-Zone Compliance Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Zone Safety & Compliance Performance Scorecard
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Live Sync from CCTV Grid</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Plant Zone</th>
                <th className="py-3 px-4">Building</th>
                <th className="py-3 px-4">Active Workers</th>
                <th className="py-3 px-4">Mandatory Gear</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{zone.name}</td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">{zone.building}</td>
                  <td className="py-3 px-4 font-mono text-slate-200 whitespace-nowrap">{zone.activeWorkers} on floor</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {zone.mandatoryPPE.join(', ')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {zone.riskLevel === 'critical' ? (
                      <span className="font-mono text-[10px] text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                        CRITICAL
                      </span>
                    ) : zone.riskLevel === 'elevated' ? (
                      <span className="font-mono text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        ELEVATED
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        NOMINAL
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                    <span className={zone.ppeComplianceRate >= 95 ? 'text-emerald-400' : 'text-amber-400'}>
                      {zone.ppeComplianceRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
