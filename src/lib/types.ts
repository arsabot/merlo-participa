export type RequestType = 
  | 'reclamo'
  | 'infraestructura'
  | 'irregularidad'
  | 'sugerencia'
  | 'propuesta'
  | 'solicitud'
  | 'otro';

export type ComplaintStatus = 
  | 'recibido'
  | 'en_revision'
  | 'validado'
  | 'derivado'
  | 'en_seguimiento'
  | 'resuelto'
  | 'cerrado';

export type UserRole = 'admin' | 'gestor' | 'moderador' | 'vecino';

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface ComplaintAttachment {
  id: string;
  complaintId: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  previousStatus?: ComplaintStatus | null;
  newStatus: ComplaintStatus;
  title: string;
  description: string;
  isInternalNote: boolean;
  authorName: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  requestType: RequestType;
  status: ComplaintStatus;
  categoryId: string;
  category?: ComplaintCategory;
  neighborhoodId: string;
  neighborhood?: Neighborhood;
  address?: string;
  referenceLocation?: string;
  latitude?: number;
  longitude?: number;
  incidentDate: string;
  
  // Privacy & moderation
  isPublic: boolean;
  isApproved: boolean;
  
  // Contact info (private)
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  privacyAccepted: boolean;
  
  // Community engagement
  supportCount: number;
  
  // Timestamps & notes
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Nested data
  updates?: ComplaintUpdate[];
  attachments?: ComplaintAttachment[];
}

export interface CreateComplaintInput {
  requestType: RequestType;
  title: string;
  description: string;
  categoryId: string;
  neighborhoodId: string;
  address?: string;
  referenceLocation?: string;
  latitude?: number;
  longitude?: number;
  incidentDate?: string;
  isPublic: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  privacyAccepted: boolean;
  attachments?: {
    fileUrl: string;
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
  }[];
}

export interface ComplaintStats {
  total: number;
  recibidos: number;
  enRevision: number;
  validados: number;
  derivados: number;
  enSeguimiento: number;
  resueltos: number;
  cerrados: number;
  byCategory: { categoryName: string; count: number; color: string }[];
  byNeighborhood: { neighborhoodName: string; count: number }[];
}

export interface FilterOptions {
  search?: string;
  categoryId?: string;
  neighborhoodId?: string;
  status?: ComplaintStatus;
  requestType?: RequestType;
  sortBy?: 'recent' | 'popular' | 'oldest';
}
