// Types for the Enterprise Portal

export interface Terminal {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  maintenanceUntil?: string;
  hours?: string;
  contactInfo?: string;
}

export interface Order {
  id: string;
  customer: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  appointmentType: 'Import' | 'Export';
  terminal: string;
  deadline: string;
  container: string;
  size: string;
  priority: 'low' | 'normal' | 'high';
  updated: string;
  assignedTo?: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'away' | 'offline';
  lastActive: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export interface PortMarket {
  id: number;
  name: string;
  region: string;
  status: 'active' | 'inactive';
}

export interface RouteRule {
  id: number;
  name: string;
  criteria: string;
  action: string;
  status: 'active' | 'inactive';
  lastTriggered: string;
}

export interface DocumentTemplate {
  id: number;
  name: string;
  type: string;
  lastModified: string;
  createdBy: string;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  today: number;
  tomorrow: number;
  thisWeek: number;
}

export interface DispatchItem {
  id: number;
  orderID: string;
  container: string;
  size: string;
  status: string;
  priority: string;
  customer: string;
  appointmentTime: string;
}

export interface EnterpriseData {
  terminals: Terminal[];
  orders: Order[];
  teamMembers: TeamMember[];
  roles: Role[];
  portMarkets: PortMarket[];
  routeRules: RouteRule[];
  documentTemplates: DocumentTemplate[];
  appointmentStats: AppointmentStats;
  dispatchItems: DispatchItem[];
}