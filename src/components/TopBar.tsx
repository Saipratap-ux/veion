import React from 'react';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { SaipratapLogo } from './SaipratapLogo';

interface TopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeCriticalAlertsCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  userRole: string;
  onRoleChange: (role: string) => void;
  onEmergencyBroadcast: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  activeCriticalAlertsCount,
  isMuted,
  onToggleMute,
  userRole,
  onRoleChange,
  onEmergencyBroadcast,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Saipratap Logo & Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#live"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('live');
            }}
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
            title="SAIPRATAP · SafeVision AI Industrial Safety"
          >
            <SaipratapLogo size="md" showText={true} />
            <span className="hidden sm:inline text-xs font-mono font-bold text-slate-400 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded">
              SafeVision AI
            </span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('live')}
            className={`transition-colors hover:text-white pb-1 relative ${
              currentTab === 'live' ? 'text-white font-semibold' : ''
            }`}
          >
            Live Surveillance
            {currentTab === 'live' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => onSelectTab('alerts')}
            className={`transition-colors hover:text-white pb-1 relative flex items-center gap-1.5 ${
              currentTab === 'alerts' ? 'text-white font-semibold' : ''
            }`}
          >
            Active Alerts
            {activeCriticalAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
            {currentTab === 'alerts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('incidents')}
            className={`transition-colors hover:text-white pb-1 relative ${
              currentTab === 'incidents' ? 'text-white font-semibold' : ''
            }`}
          >
            Incident Vault
            {currentTab === 'incidents' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('analyzer')}
            className={`transition-colors hover:text-white pb-1 relative ${
              currentTab === 'analyzer' ? 'text-white font-semibold' : ''
            }`}
          >
            Recorded Footage AI
            {currentTab === 'analyzer' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`transition-colors hover:text-white pb-1 relative ${
              currentTab === 'analytics' ? 'text-white font-semibold' : ''
            }`}
          >
            Safety Analytics
            {currentTab === 'analytics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('fleet')}
            className={`transition-colors hover:text-white pb-1 relative ${
              currentTab === 'fleet' ? 'text-white font-semibold' : ''
            }`}
          >
            Camera Fleet
            {currentTab === 'fleet' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('zones')}
            className={`transition-colors hover:text-white pb-1 relative ${
              currentTab === 'zones' ? 'text-white font-semibold' : ''
            }`}
          >
            Plant Zones
            {currentTab === 'zones' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary actions & system tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Siren sound control */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isMuted
                ? 'border-slate-800 text-slate-500 hover:text-slate-300'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
            title={isMuted ? 'Unmute Audio Alarm Sirens' : 'Mute Audio Alarm Sirens'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline font-mono">{isMuted ? 'Muted' : 'Siren'}</span>
          </button>

          {/* Role Switcher */}
          <select
            value={userRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 font-medium"
            title="Switch User View Role"
          >
            <option value="Safety Officer">Safety Officer</option>
            <option value="Safety Manager">Safety Manager</option>
            <option value="Factory Admin">Factory Admin</option>
            <option value="Zone Supervisor">Zone Supervisor</option>
          </select>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Emergency Alert Trigger / Action */}
          <button
            onClick={onEmergencyBroadcast}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600/90 hover:bg-red-500 rounded-lg transition-colors border border-red-500/50 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Facility Broadcast</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 overflow-x-auto text-xs font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('live')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'live' ? 'text-amber-400 bg-slate-800/80' : 'hover:text-white'
          }`}
        >
          Live CCTV
        </button>
        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-2.5 py-1 whitespace-nowrap rounded flex items-center gap-1 ${
            currentTab === 'alerts' ? 'text-amber-400 bg-slate-800/80' : 'hover:text-white'
          }`}
        >
          Alerts
          {activeCriticalAlertsCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          )}
        </button>
        <button
          onClick={() => onSelectTab('incidents')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'incidents' ? 'text-amber-400 bg-slate-800/80' : 'hover:text-white'
          }`}
        >
          Incidents
        </button>
        <button
          onClick={() => onSelectTab('analyzer')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'analyzer' ? 'text-amber-400 bg-slate-800/80' : 'hover:text-white'
          }`}
        >
          Footage AI
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'analytics' ? 'text-amber-400 bg-slate-800/80' : 'hover:text-white'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => onSelectTab('fleet')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            currentTab === 'fleet' ? 'text-amber-400 bg-slate-800/80' : 'hover:text-white'
          }`}
        >
          Fleet
        </button>
      </div>
    </header>
  );
};
