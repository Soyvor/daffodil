export interface DriverInfo {
  name: string;
  status: 'connected' | 'disconnected';
  currentDriver: string;
  availableDrivers: string[];
}
