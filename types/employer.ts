export interface Employer {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  createdAt: { seconds: number; nanoseconds: number } | Date;
  approved?: boolean;
  disabled?: boolean;
  /** Admin-defined tag (e.g. EMP-001) */
  employerTagId?: string;
  /** For filtering in admin */
  industryCategory?: string;
}
