import { 
  Complaint, 
  ComplaintStats, 
  CreateComplaintInput, 
  FilterOptions, 
  ComplaintStatus, 
  ComplaintUpdate 
} from '../types';
import { NEIGHBORHOODS, COMPLAINT_CATEGORIES } from '../constants';
import { generateTrackingCode } from '../utils';

// Realistic sample seed complaints for Merlo
const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c-1',
    trackingCode: 'MP-2026-A8F2',
    title: 'Luminarias quemadas en Av. Calle Real y 25 de Mayo',
    description: 'Toda la cuadra se encuentra a oscuras desde hace dos semanas. Genera un foco de inseguridad importante para los vecinos que regresan en el colectivo por la noche.',
    requestType: 'infraestructura',
    status: 'en_seguimiento',
    categoryId: 'cat-1', // Alumbrado público
    neighborhoodId: 'n-1', // Merlo Centro
    address: 'Av. Calle Real 450',
    referenceLocation: 'A 100m de la estación de tren Merlo, esquina 25 de Mayo',
    latitude: -34.6658,
    longitude: -34.7299,
    incidentDate: '2026-03-05',
    isPublic: true,
    isApproved: true,
    contactName: 'Martín Rodríguez',
    contactEmail: 'martin.rodriguez@example.com',
    contactPhone: '11-4589-2311',
    privacyAccepted: true,
    supportCount: 14,
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updates: [
      {
        id: 'u-1-1',
        complaintId: 'c-1',
        previousStatus: null,
        newStatus: 'recibido',
        title: 'Reclamo recibido',
        description: 'Se recepcionó el reporte de luminarias en el portal Merlo Participa.',
        isInternalNote: false,
        authorName: 'Sistema Merlo Participa',
        createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-1-2',
        complaintId: 'c-1',
        previousStatus: 'recibido',
        newStatus: 'validado',
        title: 'Problemática constatada en territorio',
        description: 'Equipo de LLA Merlo constató 4 postes consecutivos con artefactos LED fuera de servicio.',
        isInternalNote: false,
        authorName: 'Equipo Territorial LLA',
        createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-1-3',
        complaintId: 'c-1',
        previousStatus: 'validado',
        newStatus: 'derivado',
        title: 'Ingreso formal de reclamo y pedido de informe',
        description: 'Se elevó solicitud formal de reparación a la secretaría de alumbrado público correspondiente.',
        isInternalNote: false,
        authorName: 'Secretaría de Gestión Barrial LLA',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-1-4',
        complaintId: 'c-1',
        previousStatus: 'derivado',
        newStatus: 'en_seguimiento',
        title: 'Reiteración y seguimiento vecinal',
        description: 'Se realiza monitoreo semanal del circuito para verificar la cuadrilla de reposición.',
        isInternalNote: false,
        authorName: 'Mesa de Atención al Vecino',
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    attachments: [
      {
        id: 'att-1',
        complaintId: 'c-1',
        fileUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=60',
        fileName: 'luminaria_oscuridad_calle_real.jpg',
        fileSizeBytes: 245000,
        mimeType: 'image/jpeg',
        createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'c-2',
    trackingCode: 'MP-2026-B3K7',
    title: 'Cráter peligroso en calle Noguera y Zarate',
    description: 'Bache de grandes dimensiones que abarca casi toda la calzada. Ya rompió el tren delantero de varios autos y las motos deben esquivarlo sobre la vereda.',
    requestType: 'infraestructura',
    status: 'derivado',
    categoryId: 'cat-2', // Calles y baches
    neighborhoodId: 'n-2', // San Antonio de Padua
    address: 'Noguera 1250',
    referenceLocation: 'Entre Zárate y Directorio, Padua Sur',
    latitude: -34.6730,
    longitude: -58.6940,
    incidentDate: '2026-03-08',
    isPublic: true,
    isApproved: true,
    contactName: 'Lucía Fernández',
    contactEmail: 'lucia.f@example.com',
    contactPhone: '11-6622-9900',
    privacyAccepted: true,
    supportCount: 29,
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updates: [
      {
        id: 'u-2-1',
        complaintId: 'c-2',
        previousStatus: null,
        newStatus: 'recibido',
        title: 'Reporte ingresado',
        description: 'Recepción del reporte de rotura de pavimento.',
        isInternalNote: false,
        authorName: 'Sistema Merlo Participa',
        createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-2-2',
        complaintId: 'c-2',
        previousStatus: 'recibido',
        newStatus: 'derivado',
        title: 'Proyecto de resolución presentado',
        description: 'Presentado en el bloque legislativo para exigir plan de bacheo urgente en Noguera.',
        isInternalNote: false,
        authorName: 'Bloque LLA Merlo',
        createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    attachments: [
      {
        id: 'att-2',
        complaintId: 'c-2',
        fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60',
        fileName: 'bache_noguera.jpg',
        fileSizeBytes: 310000,
        mimeType: 'image/jpeg',
        createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'c-3',
    trackingCode: 'MP-2026-X9M4',
    title: 'Microbasural en predio de Av. Bella Vista y Ruta 1003',
    description: 'Acumulación descontrolada de basura, ramas y escombros. Foco infeccioso y de roedores a escasos metros de viviendas familiares.',
    requestType: 'irregularidad',
    status: 'en_revision',
    categoryId: 'cat-3', // Recolección de residuos
    neighborhoodId: 'n-3', // Libertad
    address: 'Av. Bella Vista 3800',
    referenceLocation: 'Frente al cruce con Ruta 1003',
    latitude: -34.7040,
    longitude: -58.6810,
    incidentDate: '2026-03-12',
    isPublic: true,
    isApproved: true,
    contactName: 'Carlos Benítez',
    contactEmail: 'carlos.benitez@example.com',
    privacyAccepted: true,
    supportCount: 18,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updates: [
      {
        id: 'u-3-1',
        complaintId: 'c-3',
        previousStatus: null,
        newStatus: 'recibido',
        title: 'Reporte ingresado',
        description: 'Denuncia comunitaria de basural a cielo abierto.',
        isInternalNote: false,
        authorName: 'Sistema Merlo Participa',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-3-2',
        complaintId: 'c-3',
        previousStatus: 'recibido',
        newStatus: 'en_revision',
        title: 'Evaluación de impacto ambiental barrial',
        description: 'Relevando dimensiones del basural y recurrencia de camiones clandestinos.',
        isInternalNote: false,
        authorName: 'Equipo de Medio Ambiente LLA',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'c-4',
    trackingCode: 'MP-2026-P4R1',
    title: 'Zanja anegada e inundaciones recurrentes en Barrio Parque San Martín',
    description: 'Cada lluvia moderada el agua sube a las veredas y no escurre porque los desagües pluviales están totalmente tapados de sedimentos.',
    requestType: 'infraestructura',
    status: 'validado',
    categoryId: 'cat-4', // Inundaciones y desagües
    neighborhoodId: 'n-4', // Parque San Martín
    address: 'Calle Gómez Fretes y Balbastro',
    referenceLocation: 'A tres cuadras de la plaza central del barrio',
    latitude: -34.6860,
    longitude: -58.7360,
    incidentDate: '2026-03-10',
    isPublic: true,
    isApproved: true,
    contactName: 'Silvia Maidana',
    contactEmail: 'silvia.m@example.com',
    privacyAccepted: true,
    supportCount: 22,
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updates: [
      {
        id: 'u-4-1',
        complaintId: 'c-4',
        previousStatus: null,
        newStatus: 'recibido',
        title: 'Reclamo recibido',
        description: 'Solicitud de limpieza de sumideros y desagües.',
        isInternalNote: false,
        authorName: 'Sistema Merlo Participa',
        createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-4-2',
        complaintId: 'c-4',
        previousStatus: 'recibido',
        newStatus: 'validado',
        title: 'Verificación hidráulica',
        description: 'Confirmado taponamiento de cañerías en el cruce de Gómez Fretes.',
        isInternalNote: false,
        authorName: 'Mesa Técnica LLA',
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'c-5',
    trackingCode: 'MP-2026-L2Z8',
    title: 'Propuesta: Instalación de reductores de velocidad en acceso a Escuela N° 14',
    description: 'Proponemos la colocación de lomos de burro reglamentarios y señalización vial en el horario de entrada y salida escolar para proteger a los alumnos.',
    requestType: 'propuesta',
    status: 'validado',
    categoryId: 'cat-8', // Tránsito y señalización
    neighborhoodId: 'n-6', // Mariano Acosta
    address: 'Av. Constituyentes 890',
    referenceLocation: 'Frente a la Escuela N° 14 y Jardín de Infantes',
    latitude: -34.7210,
    longitude: -58.7880,
    incidentDate: '2026-03-14',
    isPublic: true,
    isApproved: true,
    contactName: 'Gustavo Paoli',
    contactEmail: 'gustavo.p@example.com',
    privacyAccepted: true,
    supportCount: 45,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updates: [
      {
        id: 'u-5-1',
        complaintId: 'c-5',
        previousStatus: null,
        newStatus: 'recibido',
        title: 'Propuesta comunitaria recepcionada',
        description: 'Iniciativa vecinal para seguridad vial escolar.',
        isInternalNote: false,
        authorName: 'Sistema Merlo Participa',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-5-2',
        complaintId: 'c-5',
        previousStatus: 'recibido',
        newStatus: 'validado',
        title: 'Incorporada a cartera de proyectos barriales',
        description: 'Se preparó anteproyecto para canalizar la petición ante las comisiones de transporte.',
        isInternalNote: false,
        authorName: 'Comisión de Educación y Tránsito LLA',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'c-6',
    trackingCode: 'MP-2026-R5T9',
    title: 'Reparación de bomba de agua y luminarias en Plaza de Pontevedra',
    description: 'Se gestionó y constató la reparación del sistema de riego y el reemplazo de 6 farolas en el centro de la plaza principal.',
    requestType: 'infraestructura',
    status: 'resuelto',
    categoryId: 'cat-7', // Espacios verdes
    neighborhoodId: 'n-5', // Pontevedra
    address: 'Plaza Central de Pontevedra',
    referenceLocation: 'Entre Av. Otero y De la Unión',
    latitude: -34.7460,
    longitude: -58.6940,
    incidentDate: '2026-02-18',
    isPublic: true,
    isApproved: true,
    contactName: 'Valeria Soria',
    contactEmail: 'valeria.soria@example.com',
    privacyAccepted: true,
    supportCount: 38,
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Problemática verificada como subsanada por los vecinos del barrio y equipo de relevamiento LLA el 12 de marzo de 2026.',
    resolvedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updates: [
      {
        id: 'u-6-1',
        complaintId: 'c-6',
        previousStatus: null,
        newStatus: 'recibido',
        title: 'Reclamo recibido',
        description: 'Recepción del reporte de mantenimiento de plaza.',
        isInternalNote: false,
        authorName: 'Sistema Merlo Participa',
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-6-2',
        complaintId: 'c-6',
        previousStatus: 'recibido',
        newStatus: 'derivado',
        title: 'Elevación de reclamo a delegación Pontevedra',
        description: 'Se impulsó el pedido de recambio de luminarias y arreglo de bomba.',
        isInternalNote: false,
        authorName: 'Gestión Barrial Pontevedra LLA',
        createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'u-6-3',
        complaintId: 'c-6',
        previousStatus: 'derivado',
        newStatus: 'resuelto',
        title: 'Verificación de resolución en territorio',
        description: 'Se constató el funcionamiento correcto de las farolas y la bomba de la plaza junto a vecinos referentes.',
        isInternalNote: false,
        authorName: 'Mesa Directiva LLA Merlo',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

const STORAGE_KEY = 'merlo_participa_complaints_v1';
const SUPPORTS_STORAGE_KEY = 'merlo_participa_user_supports_v1';

function getLocalStore(): Complaint[] {
  if (typeof window === 'undefined') {
    return INITIAL_COMPLAINTS.map(enrichComplaint);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS.map(enrichComplaint);
    }
    const parsed = JSON.parse(raw) as Complaint[];
    return parsed.map(enrichComplaint);
  } catch (e) {
    console.error('Error reading localStorage for complaints', e);
    return INITIAL_COMPLAINTS.map(enrichComplaint);
  }
}

function saveLocalStore(complaints: Complaint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Error saving complaints to localStorage', e);
  }
}

function enrichComplaint(c: Complaint): Complaint {
  const category = COMPLAINT_CATEGORIES.find((cat) => cat.id === c.categoryId) || {
    id: c.categoryId,
    name: 'General',
    slug: 'general',
    icon: 'AlertCircle',
    color: '#391759',
    description: '',
  };
  const neighborhood = NEIGHBORHOODS.find((n) => n.id === c.neighborhoodId) || {
    id: c.neighborhoodId,
    name: 'Merlo',
    slug: 'merlo',
    latitude: -34.6653,
    longitude: -58.7292,
  };
  return {
    ...c,
    category,
    neighborhood,
  };
}

export const complaintsService = {
  getComplaints(filters?: FilterOptions): Complaint[] {
    const all = getLocalStore();
    let result = all.filter((c) => c.isPublic && c.isApproved);

    if (!filters) {
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.trackingCode.toLowerCase().includes(q) ||
          (c.address && c.address.toLowerCase().includes(q))
      );
    }

    if (filters.categoryId && filters.categoryId !== 'all') {
      result = result.filter((c) => c.categoryId === filters.categoryId);
    }

    if (filters.neighborhoodId && filters.neighborhoodId !== 'all') {
      result = result.filter((c) => c.neighborhoodId === filters.neighborhoodId);
    }

    if (filters.status && filters.status !== ('all' as any)) {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters.requestType && filters.requestType !== ('all' as any)) {
      result = result.filter((c) => c.requestType === filters.requestType);
    }

    if (filters.sortBy === 'popular') {
      result.sort((a, b) => b.supportCount - a.supportCount);
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  },

  getAllForAdmin(filters?: FilterOptions): Complaint[] {
    const all = getLocalStore();
    let result = [...all];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.trackingCode.toLowerCase().includes(q) ||
          c.contactName.toLowerCase().includes(q) ||
          c.contactEmail.toLowerCase().includes(q)
      );
    }

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter((c) => c.categoryId === filters.categoryId);
    }

    if (filters?.neighborhoodId && filters.neighborhoodId !== 'all') {
      result = result.filter((c) => c.neighborhoodId === filters.neighborhoodId);
    }

    if (filters?.status && filters.status !== ('all' as any)) {
      result = result.filter((c) => c.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getComplaintById(id: string): Complaint | null {
    const all = getLocalStore();
    const found = all.find((c) => c.id === id);
    return found ? enrichComplaint(found) : null;
  },

  getComplaintByTrackingCode(trackingCode: string): Complaint | null {
    const cleanCode = trackingCode.trim().toUpperCase();
    const all = getLocalStore();
    const found = all.find((c) => c.trackingCode.toUpperCase() === cleanCode);
    return found ? enrichComplaint(found) : null;
  },

  createComplaint(input: CreateComplaintInput): Complaint {
    const all = getLocalStore();
    const trackingCode = generateTrackingCode();
    const id = 'c-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    const neighborhood = NEIGHBORHOODS.find((n) => n.id === input.neighborhoodId);
    const lat = input.latitude || (neighborhood ? neighborhood.latitude : -34.6653);
    const lng = input.longitude || (neighborhood ? neighborhood.longitude : -58.7292);

    const initialUpdate: ComplaintUpdate = {
      id: 'u-' + Date.now().toString(36),
      complaintId: id,
      previousStatus: null,
      newStatus: 'recibido',
      title: 'Reclamo ingresado al portal',
      description: 'Su solicitud ha sido registrada correctamente con el código ' + trackingCode + '.',
      isInternalNote: false,
      authorName: 'Sistema Merlo Participa',
      createdAt: now,
    };

    const newComplaint: Complaint = {
      id,
      trackingCode,
      title: input.title,
      description: input.description,
      requestType: input.requestType,
      status: 'recibido',
      categoryId: input.categoryId,
      neighborhoodId: input.neighborhoodId,
      address: input.address || '',
      referenceLocation: input.referenceLocation || '',
      latitude: lat,
      longitude: lng,
      incidentDate: input.incidentDate || now.split('T')[0],
      isPublic: input.isPublic,
      isApproved: true, // Auto-approved for demonstration, editable in moderation
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone || '',
      privacyAccepted: input.privacyAccepted,
      supportCount: 1, // Author counts as 1st support
      createdAt: now,
      updatedAt: now,
      updates: [initialUpdate],
      attachments: input.attachments
        ? input.attachments.map((att, idx) => ({
            id: 'att-' + Date.now() + '-' + idx,
            complaintId: id,
            fileUrl: att.fileUrl,
            fileName: att.fileName,
            fileSizeBytes: att.fileSizeBytes,
            mimeType: att.mimeType,
            createdAt: now,
          }))
        : [],
    };

    const updatedList = [newComplaint, ...all];
    saveLocalStore(updatedList);
    return enrichComplaint(newComplaint);
  },

  supportComplaint(complaintId: string, fingerprint: string): { success: boolean; newCount: number; message: string } {
    if (typeof window === 'undefined') {
      return { success: false, newCount: 0, message: 'No disponible en servidor' };
    }
    
    try {
      const supportsRaw = localStorage.getItem(SUPPORTS_STORAGE_KEY) || '{}';
      const userSupports = JSON.parse(supportsRaw) as Record<string, string[]>;
      
      const complaintSupports = userSupports[complaintId] || [];
      if (complaintSupports.includes(fingerprint)) {
        const all = getLocalStore();
        const current = all.find((c) => c.id === complaintId);
        return { 
          success: false, 
          newCount: current ? current.supportCount : 0, 
          message: 'Ya has apoyado este reporte anteriormente.' 
        };
      }

      complaintSupports.push(fingerprint);
      userSupports[complaintId] = complaintSupports;
      localStorage.setItem(SUPPORTS_STORAGE_KEY, JSON.stringify(userSupports));

      const all = getLocalStore();
      const targetIndex = all.findIndex((c) => c.id === complaintId);
      if (targetIndex === -1) {
        return { success: false, newCount: 0, message: 'Reclamo no encontrado.' };
      }

      all[targetIndex].supportCount = (all[targetIndex].supportCount || 0) + 1;
      all[targetIndex].updatedAt = new Date().toISOString();
      saveLocalStore(all);

      return {
        success: true,
        newCount: all[targetIndex].supportCount,
        message: '¡Gracias! Tu apoyo fue sumado al reclamo.',
      };
    } catch (e) {
      console.error('Error supporting complaint', e);
      return { success: false, newCount: 0, message: 'Error al procesar el apoyo.' };
    }
  },

  hasUserSupported(complaintId: string, fingerprint: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const supportsRaw = localStorage.getItem(SUPPORTS_STORAGE_KEY) || '{}';
      const userSupports = JSON.parse(supportsRaw) as Record<string, string[]>;
      return (userSupports[complaintId] || []).includes(fingerprint);
    } catch {
      return false;
    }
  },

  updateComplaintStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    updateTitle: string,
    updateDescription: string,
    isInternalNote: boolean = false,
    authorName: string = 'Equipo Merlo Participa'
  ): Complaint | null {
    const all = getLocalStore();
    const index = all.findIndex((c) => c.id === complaintId);
    if (index === -1) return null;

    const current = all[index];
    const prevStatus = current.status;
    const now = new Date().toISOString();

    const newUpdate: ComplaintUpdate = {
      id: 'u-' + Date.now().toString(36),
      complaintId,
      previousStatus: prevStatus,
      newStatus,
      title: updateTitle,
      description: updateDescription,
      isInternalNote,
      authorName,
      createdAt: now,
    };

    const updatedComplaint: Complaint = {
      ...current,
      status: newStatus,
      updatedAt: now,
      updates: [newUpdate, ...(current.updates || [])],
      ...(newStatus === 'resuelto'
        ? { resolvedAt: now, resolutionNotes: updateDescription }
        : {}),
    };

    all[index] = updatedComplaint;
    saveLocalStore(all);
    return enrichComplaint(updatedComplaint);
  },

  setModerationStatus(complaintId: string, isApproved: boolean, isPublic?: boolean): Complaint | null {
    const all = getLocalStore();
    const index = all.findIndex((c) => c.id === complaintId);
    if (index === -1) return null;

    all[index].isApproved = isApproved;
    if (typeof isPublic === 'boolean') {
      all[index].isPublic = isPublic;
    }
    all[index].updatedAt = new Date().toISOString();
    saveLocalStore(all);
    return enrichComplaint(all[index]);
  },

  getStats(): ComplaintStats {
    const all = getLocalStore();
    const stats: ComplaintStats = {
      total: all.length,
      recibidos: all.filter((c) => c.status === 'recibido').length,
      enRevision: all.filter((c) => c.status === 'en_revision').length,
      validados: all.filter((c) => c.status === 'validado').length,
      derivados: all.filter((c) => c.status === 'derivado').length,
      enSeguimiento: all.filter((c) => c.status === 'en_seguimiento').length,
      resueltos: all.filter((c) => c.status === 'resuelto').length,
      cerrados: all.filter((c) => c.status === 'cerrado').length,
      byCategory: COMPLAINT_CATEGORIES.map((cat) => ({
        categoryName: cat.name,
        count: all.filter((c) => c.categoryId === cat.id).length,
        color: cat.color,
      })).filter((item) => item.count > 0),
      byNeighborhood: NEIGHBORHOODS.map((n) => ({
        neighborhoodName: n.name,
        count: all.filter((c) => c.neighborhoodId === n.id).length,
      })).filter((item) => item.count > 0),
    };
    return stats;
  },
};
