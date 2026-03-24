export interface Candidate {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  currentlyResiding?: string;
  permanentAddress?: string;
  industryCategory?: string;
  desiredRole?: string;
  education: string;
  skills: string;
  experience: string;
  preferredJob: string;
  documentIdURL: string;
  passportPhotoURL: string;
  certificateURLs?: string[];
  createdAt: { seconds: number; nanoseconds: number } | Date;
}

export interface CandidateFormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  currentlyResiding?: string;
  permanentAddress?: string;
  industryCategory?: string;
  desiredRole?: string;
  education: string;
  skills: string;
  experience: string;
  preferredJob: string;
}
