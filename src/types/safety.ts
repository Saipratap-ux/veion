export type SeverityLevel = 'critical' | 'high' | 'medium' | 'info';
export type IncidentStatus = 'active' | 'investigating' | 'resolved';

export interface BoundingBox {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  w: number; // percentage (0-100)
  h: number; // percentage (0-100)
}

export interface WorkerEquipmentStatus {
  detected: boolean;
  confidence: number;
}

export interface DetectedWorker {
  id: string;
  name: string;
  role: string;
  bbox: BoundingBox;
  helmet: WorkerEquipmentStatus;
  vest: WorkerEquipmentStatus;
  footwear: WorkerEquipmentStatus;
  gloves: WorkerEquipmentStatus;
  isCompliant: boolean;
  violations: string[];
}

export interface DetectedHazard {
  id: string;
  type: 'fire' | 'smoke';
  confidence: number;
  bbox: BoundingBox;
  description: string;
}

export interface CameraFeed {
  id: string;
  name: string;
  factory: string;
  building: string;
  zone: string;
  streamUrl: string;
  imagePoster: string;
  status: 'online' | 'offline' | 'processing' | 'warning';
  fps: number;
  bitrate: string;
  resolution: string;
  enabled: boolean;
  ppeModelEnabled: boolean;
  smokeModelEnabled: boolean;
  fireModelEnabled: boolean;
  confidenceThreshold: number;
  workers: DetectedWorker[];
  hazards: DetectedHazard[];
}

export interface AlertItem {
  id: string;
  type: 'fire_detected' | 'smoke_detected' | 'ppe_violation';
  severity: SeverityLevel;
  title: string;
  description: string;
  factory: string;
  building: string;
  zone: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  confidence: number;
  status: IncidentStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  snapshotUrl: string;
  workerId?: string;
  workerName?: string;
  missingItems?: string[];
}

export interface FactoryZone {
  id: string;
  name: string;
  building: string;
  activeWorkers: number;
  riskLevel: 'nominal' | 'elevated' | 'critical';
  cameraCount: number;
  ppeComplianceRate: number;
  mandatoryPPE: ('helmet' | 'vest' | 'footwear' | 'gloves')[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}
