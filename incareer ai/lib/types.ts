export type TaskStatus = 'Completed' | 'Pending' | 'Available';

export interface Task {
  id: string;
  taskNumber: number | string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  submittedOnTrack?: boolean;
  description: string;
  keyFeatures?: string[];
  iconType?: 'linkedin' | 'number' | 'cert';
  bottomStatusText?: string;
  isCertificateTask?: boolean;
  paymentRequired?: boolean;
  paymentWarning?: string;
  paymentDescription?: string;
  bottomCtaText?: string;
  submissionUrl?: string;
  submittedAt?: string;
}

export interface UserProfile {
  name: string;
  initials: string;
  internId: string;
  domain: string;
  joinedOn: string;
  status: 'Active' | 'Completed' | 'Inactive';
  totalInternships: number;
  completedInternships: number;
  email: string;
  phone: string;
  college: string;
  graduationYear: string;
  avatarUrl?: string;
}

export interface InternshipDomain {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  projectCount: number;
  category: string;
  skills: string[];
  popular?: boolean;
}

export interface PaymentItem {
  id: string;
  title: string;
  purpose: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed';
  dueDate: string;
  transactionId?: string;
  invoiceUrl?: string;
}

export interface CertificateData {
  id: string;
  certId: string;
  studentName: string;
  program: string;
  issueDate: string;
  status: 'Verified' | 'Pending Payment' | 'Processing';
  verificationUrl: string;
  pdfUrl?: string;
}

/* ---------- Admin Dashboard Types ---------- */

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Review';

export interface InternshipApplication {
  id: string;
  studentName: string;
  studentInitials: string;
  email: string;
  domain: string;
  appliedOn: string;
  status: ApplicationStatus;
}

export interface PlatformStats {
  totalStudents: number;
  activeInterns: number;
  completedInterns: number;
  pendingApplications: number;
  totalApplications: number;
  totalRevenue: number;
  pendingRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  issuedCertificates: number;
}

export type OfferLetterStatus = 'Active' | 'Draft';

export interface OfferLetterTemplate {
  id: string;
  name: string;
  status: OfferLetterStatus;
  updatedAt: string;
}

export interface AdminPayment {
  id: string;
  studentName: string;
  internId: string;
  purpose: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  date: string;
  transactionId?: string;
}

export interface AdminUser {
  name: string;
  initials: string;
  email: string;
  role: string;
  password?: string;
}
