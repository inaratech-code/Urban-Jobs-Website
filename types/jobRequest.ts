export interface JobRequest {
  id: string;
  fullName: string;
  phone: string;
  desiredRole: string;
  message?: string;
  createdAt: { seconds: number; nanoseconds: number } | Date;
}
