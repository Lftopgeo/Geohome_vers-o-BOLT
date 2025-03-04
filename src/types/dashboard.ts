export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface InspectionSummary {
  id: string;
  protocol: string;
  address: string;
  date: Date;
  status: InspectionStatus;
  clientName: string;
  propertyType: string;
  inspectorName: string;
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
}

export type ActivityType = 
  | 'inspection_created'
  | 'inspection_updated'
  | 'inspection_completed'
  | 'report_generated'
  | 'client_feedback'
  | 'system_notification';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  user: string;
  relatedEntityId?: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  type: 'inspection' | 'meeting' | 'deadline' | 'other';
  status?: InspectionStatus;
  location?: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

export interface PerformanceMetrics {
  inspectionsPerMonth: ChartData;
  inspectionsByType: ChartData;
  inspectionsByStatus: ChartData;
  completionTimeAverage: ChartData;
}
