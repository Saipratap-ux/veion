import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { LiveSurveillance } from './components/LiveSurveillance';
import { AlertsManager } from './components/AlertsManager';
import { IncidentVault } from './components/IncidentVault';
import { RecordedFootageAnalyzer } from './components/RecordedFootageAnalyzer';
import { SafetyAnalytics } from './components/SafetyAnalytics';
import { CameraFleetManager } from './components/CameraFleetManager';
import { PlantZonesView } from './components/PlantZonesView';
import { WorkerPPEInspectorModal } from './components/WorkerPPEInspectorModal';
import { EmergencyBroadcastModal } from './components/EmergencyBroadcastModal';
import { OfflineIndicator } from './components/PWAInstallButton';
import { SaipratapLogo } from './components/SaipratapLogo';

import { CameraFeed, DetectedWorker, AlertItem, FactoryZone, AuditLogItem } from './types/safety';
import { INITIAL_CAMERAS, INITIAL_ALERTS, INITIAL_ZONES, INITIAL_AUDIT_LOGS, imgFactoryFloor, imgSmokeHazard, imgFireIncident, imgPPEInspection } from './utils/mockData';
import { audioAlarm } from './utils/audioAlarm';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('live');
  const [userRole, setUserRole] = useState<string>('Safety Officer');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Core Data State
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [zones, setZones] = useState<FactoryZone[]>(INITIAL_ZONES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Active Modals & Selection State
  const [inspectingWorker, setInspectingWorker] = useState<{ worker: DetectedWorker; camera: CameraFeed } | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioAlarm.setMuted(nextMute);
    showToast(nextMute ? 'Alarm sirens muted' : 'Alarm sirens active');
  };

  // 1. Worker Inspection & Warning Dispatch
  const handleSelectWorker = (worker: DetectedWorker, camera: CameraFeed) => {
    setInspectingWorker({ worker, camera });
  };

  const handleIssueWarning = (worker: DetectedWorker, camera: CameraFeed, note: string) => {
    audioAlarm.playWarningChime();
    const newAlert: AlertItem = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'ppe_violation',
      severity: 'medium',
      title: `Worker PPE Non-Compliance: ${worker.name}`,
      description: `${note} Missing: ${worker.violations.join(', ')}`,
      factory: camera.factory,
      building: camera.building,
      zone: camera.zone,
      cameraId: camera.id,
      cameraName: camera.name,
      timestamp: 'Just now',
      confidence: 94.2,
      status: 'active',
      snapshotUrl: camera.imagePoster,
      workerId: worker.id,
      workerName: worker.name,
      missingItems: worker.violations,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Floor Warning dispatched to ${worker.name} in ${camera.zone}`);
  };

  // 2. Incident Simulation (Testing verification for Hackathon / Problem Statement 6)
  const handleSimulateHazard = (camera: CameraFeed, type: 'fire' | 'smoke' | 'ppe') => {
    if (type === 'fire') {
      audioAlarm.playCriticalSiren();
      const updatedCameras = cameras.map((c) => {
        if (c.id === camera.id) {
          return {
            ...c,
            status: 'warning' as const,
            hazards: [
              ...c.hazards.filter((h) => h.type !== 'fire'),
              {
                id: `haz-fire-${Date.now()}`,
                type: 'fire' as const,
                confidence: 98.4,
                bbox: { x: 35, y: 40, w: 30, h: 35 },
                description: 'Open flame combustion pattern identified near equipment rack',
              },
            ],
          };
        }
        return c;
      });
      setCameras(updatedCameras);

      const newAlert: AlertItem = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'fire_detected',
        severity: 'critical',
        title: `CRITICAL FIRE DETECTED on ${camera.id}`,
        description: `Rapid thermal signature confirmation on camera ${camera.id} at ${camera.zone}. Immediate intervention dispatched.`,
        factory: camera.factory,
        building: camera.building,
        zone: camera.zone,
        cameraId: camera.id,
        cameraName: camera.name,
        timestamp: 'Just now',
        confidence: 98.4,
        status: 'active',
        snapshotUrl: camera.imagePoster,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`🔥 CRITICAL FIRE ALERT triggered on ${camera.id}!`);
    } else if (type === 'smoke') {
      audioAlarm.playCriticalSiren();
      const updatedCameras = cameras.map((c) => {
        if (c.id === camera.id) {
          return {
            ...c,
            hazards: [
              ...c.hazards.filter((h) => h.type !== 'smoke'),
              {
                id: `haz-smoke-${Date.now()}`,
                type: 'smoke' as const,
                confidence: 93.1,
                bbox: { x: 20, y: 15, w: 35, h: 40 },
                description: 'Optical smoke gradient detected',
              },
            ],
          };
        }
        return c;
      });
      setCameras(updatedCameras);

      const newAlert: AlertItem = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'smoke_detected',
        severity: 'high',
        title: `SMOKE DETECTED on ${camera.id}`,
        description: `Visual smoke tracking anomaly identified near ${camera.zone}.`,
        factory: camera.factory,
        building: camera.building,
        zone: camera.zone,
        cameraId: camera.id,
        cameraName: camera.name,
        timestamp: 'Just now',
        confidence: 93.1,
        status: 'active',
        snapshotUrl: camera.imagePoster,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`💨 Smoke Hazard alert dispatched for ${camera.zone}`);
    } else {
      audioAlarm.playWarningChime();
      const updatedCameras = cameras.map((c) => {
        if (c.id === camera.id) {
          return {
            ...c,
            workers: [
              ...c.workers,
              {
                id: `w-${Date.now()}`,
                name: 'Shift Technician',
                role: 'Assembly Worker',
                bbox: { x: 45, y: 25, w: 22, h: 60 },
                helmet: { detected: false, confidence: 15 },
                vest: { detected: true, confidence: 94 },
                footwear: { detected: true, confidence: 91 },
                gloves: { detected: false, confidence: 18 },
                isCompliant: false,
                violations: ['Missing Helmet', 'Missing Gloves'],
              },
            ],
          };
        }
        return c;
      });
      setCameras(updatedCameras);

      const newAlert: AlertItem = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'ppe_violation',
        severity: 'medium',
        title: `Dual PPE Infringement on ${camera.id}`,
        description: `Worker observed without mandatory Hardhat and Gloves in ${camera.zone}.`,
        factory: camera.factory,
        building: camera.building,
        zone: camera.zone,
        cameraId: camera.id,
        cameraName: camera.name,
        timestamp: 'Just now',
        confidence: 91.5,
        status: 'active',
        snapshotUrl: camera.imagePoster,
        missingItems: ['Helmet', 'Gloves'],
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`⚠️ PPE Violation detected on ${camera.id}`);
    }
  };

  // 3. Snapshot Evidence Capture
  const handleCaptureSnapshot = (camera: CameraFeed) => {
    audioAlarm.playAckChime();
    showToast(`Snapshot saved to evidence archive for ${camera.id}`);
  };

  // 4. Alert Acknowledgment
  const handleAcknowledgeAlert = (alertId: string) => {
    audioAlarm.playAckChime();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'investigating',
              acknowledgedAt: 'Just now',
              acknowledgedBy: userRole,
            }
          : a
      )
    );
    showToast(`Alert ${alertId} acknowledged by ${userRole}`);
  };

  // 5. Alert Resolution
  const handleResolveAlert = (alertId: string, notes: string) => {
    audioAlarm.playAckChime();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'resolved',
              resolvedAt: 'Just now',
              resolutionNotes: notes,
            }
          : a
      )
    );
    showToast(`Incident ${alertId} resolved and logged.`);
  };

  // 6. View Camera Feed from Alert / Incident
  const handleViewCameraFeed = (cameraId: string) => {
    setCurrentTab('live');
    showToast(`Navigated to surveillance feed ${cameraId}`);
  };

  // 7. Add Camera
  const handleAddCamera = (newCam: CameraFeed) => {
    audioAlarm.playAckChime();
    setCameras((prev) => [newCam, ...prev]);
    showToast(`CCTV camera ${newCam.id} connected and online`);
  };

  // 8. Update Camera
  const handleUpdateCamera = (updatedCam: CameraFeed) => {
    setCameras((prev) => prev.map((c) => (c.id === updatedCam.id ? updatedCam : c)));
    showToast(`Updated AI configuration for ${updatedCam.id}`);
  };

  // 9. Update Zone Policy
  const handleUpdateZone = (updatedZone: FactoryZone) => {
    setZones((prev) => prev.map((z) => (z.id === updatedZone.id ? updatedZone : z)));
    showToast(`Safety gear policy updated for ${updatedZone.name}`);
  };

  // 10. Emergency Facility Broadcast
  const handleEmergencyBroadcast = (type: string, message: string) => {
    audioAlarm.playCriticalSiren();
    showToast(`EMERGENCY BROADCAST TRANSMITTED: ${type.toUpperCase()}`);
    const alert: AlertItem = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'fire_detected',
      severity: 'critical',
      title: `FACILITY EMERGENCY BROADCAST: ${type.toUpperCase()}`,
      description: message,
      factory: 'GigaFab 01',
      building: 'All Buildings',
      zone: 'Facility Wide',
      cameraId: 'ALL-UNITS',
      cameraName: 'PA System & Optical Grid',
      timestamp: 'Just now',
      confidence: 100,
      status: 'active',
      snapshotUrl: imgFireIncident,
    };
    setAlerts((prev) => [alert, ...prev]);
  };

  const activeCriticalAlerts = alerts.filter(
    (a) => (a.severity === 'critical' || a.severity === 'high') && a.status === 'active'
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Universal Top Bar */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeCriticalAlertsCount={activeCriticalAlerts.length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        userRole={userRole}
        onRoleChange={setUserRole}
        onEmergencyBroadcast={() => setIsBroadcastModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {currentTab === 'live' && (
          <LiveSurveillance
            cameras={cameras}
            activeAlerts={alerts}
            onSelectWorker={handleSelectWorker}
            onSimulateHazard={handleSimulateHazard}
            onCaptureSnapshot={handleCaptureSnapshot}
            onOpenAddCamera={() => setCurrentTab('fleet')}
            onQuickViewAlert={(alert) => {
              setCurrentTab('alerts');
            }}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsManager
            alerts={alerts}
            userRole={userRole}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onViewCameraStream={handleViewCameraFeed}
          />
        )}

        {currentTab === 'incidents' && (
          <IncidentVault
            incidents={alerts}
            onResolveIncident={handleResolveAlert}
            onViewCameraFeed={handleViewCameraFeed}
          />
        )}

        {currentTab === 'analyzer' && <RecordedFootageAnalyzer />}

        {currentTab === 'analytics' && (
          <SafetyAnalytics zones={zones} alerts={alerts} />
        )}

        {currentTab === 'fleet' && (
          <CameraFleetManager
            cameras={cameras}
            onAddCamera={handleAddCamera}
            onUpdateCamera={handleUpdateCamera}
            onViewFeed={handleViewCameraFeed}
          />
        )}

        {currentTab === 'zones' && (
          <PlantZonesView
            zones={zones}
            cameras={cameras}
            onSelectZone={(zoneName) => {
              setCurrentTab('live');
            }}
            onUpdateZone={handleUpdateZone}
          />
        )}
      </main>

      {/* Worker PPE Inspector Modal */}
      {inspectingWorker && (
        <WorkerPPEInspectorModal
          worker={inspectingWorker.worker}
          camera={inspectingWorker.camera}
          onClose={() => setInspectingWorker(null)}
          onIssueWarning={handleIssueWarning}
        />
      )}

      {/* Emergency Facility Broadcast Modal */}
      <EmergencyBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onBroadcast={handleEmergencyBroadcast}
      />

      {/* Non-intrusive Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/80 text-white text-xs font-medium shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PWA Offline status indicator */}
      <OfflineIndicator />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SaipratapLogo size="sm" showText={true} />
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">SafeVision AI Industrial Intelligence</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Empowered by Edge Computer Vision & Multi-Camera PPE Surveillance
          </span>
        </div>
      </footer>
    </div>
  );
}
