-- Schema for Merlo Participa - Portal Vecinal Comunitario
-- Production ready PostgreSQL / Supabase migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. NEIGHBORHOODS (Barrios y Localidades de Merlo)
CREATE TABLE IF NOT EXISTS public.neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    postal_code TEXT DEFAULT '1722',
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. COMPLAINT CATEGORIES
CREATE TABLE IF NOT EXISTS public.complaint_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'AlertCircle',
    color TEXT NOT NULL DEFAULT '#6C35C7',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROFILES / USERS (Administradores y Gestores)
CREATE TYPE public.user_role AS ENUM ('admin', 'gestor', 'moderador', 'vecino');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role public.user_role NOT NULL DEFAULT 'vecino',
    phone TEXT,
    neighborhood_id UUID REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COMPLAINTS (Reclamos, Sugerencias y Propuestas)
CREATE TYPE public.request_type AS ENUM (
    'reclamo',
    'infraestructura',
    'irregularidad',
    'sugerencia',
    'propuesta',
    'solicitud',
    'otro'
);

CREATE TYPE public.complaint_status AS ENUM (
    'recibido',
    'en_revision',
    'validado',
    'derivado',
    'en_seguimiento',
    'resuelto',
    'cerrado'
);

CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    request_type public.request_type NOT NULL DEFAULT 'reclamo',
    status public.complaint_status NOT NULL DEFAULT 'recibido',
    category_id UUID NOT NULL REFERENCES public.complaint_categories(id) ON DELETE RESTRICT,
    neighborhood_id UUID NOT NULL REFERENCES public.neighborhoods(id) ON DELETE RESTRICT,
    address TEXT,
    reference_location TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    incident_date DATE DEFAULT CURRENT_DATE,
    
    -- Privacidad y Visibilidad
    is_public BOOLEAN DEFAULT true NOT NULL,
    is_approved BOOLEAN DEFAULT true NOT NULL, -- Moderación
    
    -- Datos de Contacto (Privados para el equipo)
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    privacy_accepted BOOLEAN DEFAULT true NOT NULL,
    
    -- Métricas de apoyo comunitario
    support_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Auditoría
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COMPLAINT UPDATES (Historial de Estados y Trazabilidad)
CREATE TABLE IF NOT EXISTS public.complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    previous_status public.complaint_status,
    new_status public.complaint_status NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT false NOT NULL, -- Solo visible para administradores
    author_name TEXT NOT NULL DEFAULT 'Equipo Merlo Participa',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. COMPLAINT ATTACHMENTS (Evidencia Fotográfica)
CREATE TABLE IF NOT EXISTS public.complaint_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. COMPLAINT SUPPORTS (Apoyos Vecinales)
CREATE TABLE IF NOT EXISTS public.complaint_supports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    fingerprint TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_complaint_support UNIQUE (complaint_id, fingerprint)
);

-- 8. MODERATION LOGS (Auditoría Administrativa)
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    reason TEXT,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_complaints_tracking_code ON public.complaints(tracking_code);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_neighborhood ON public.complaints(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_public_approved ON public.complaints(is_public, is_approved);
CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint ON public.complaint_updates(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaint_supports_complaint ON public.complaint_supports(complaint_id);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_complaints_updated_at ON public.complaints;
CREATE TRIGGER tr_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Neighborhoods & Categories: Public read
CREATE POLICY "Public can read neighborhoods" ON public.neighborhoods FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON public.complaint_categories FOR SELECT USING (true);

-- Complaints:
-- 1. Public can read approved, public complaints
CREATE POLICY "Public can read approved complaints" ON public.complaints
FOR SELECT
USING (is_public = true AND is_approved = true);

-- 2. Anyone can create complaints (anon and authenticated)
CREATE POLICY "Anyone can create complaints" ON public.complaints
FOR INSERT
WITH CHECK (true);

-- 3. Updates: Public can read non-internal updates of approved complaints
CREATE POLICY "Public can read public updates" ON public.complaint_updates
FOR SELECT
USING (
    is_internal_note = false AND
    EXISTS (
        SELECT 1 FROM public.complaints c
        WHERE c.id = complaint_updates.complaint_id
        AND c.is_public = true
        AND c.is_approved = true
    )
);

-- 4. Supports: Public can insert and select
CREATE POLICY "Anyone can support complaints" ON public.complaint_supports
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view supports count" ON public.complaint_supports
FOR SELECT
USING (true);

-- 5. Attachments: Public can read attachments of public complaints
CREATE POLICY "Public can view attachments" ON public.complaint_attachments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.complaints c
        WHERE c.id = complaint_attachments.complaint_id
        AND c.is_public = true
        AND c.is_approved = true
    )
);

-- SEED DATA: NEIGHBORHOODS OF MERLO
INSERT INTO public.neighborhoods (name, slug, latitude, longitude, description) VALUES
('Merlo Centro', 'merlo-centro', -34.6653, -58.7292, 'Casco histórico, zona comercial y estación Merlo'),
('San Antonio de Padua', 'san-antonio-de-padua', -34.6702, -58.6974, 'Zona residencial y comercial de Padua'),
('Libertad', 'libertad', -34.7001, -58.6833, 'Localidad de Libertad y barrios aledaños'),
('Parque San Martín', 'parque-san-martin', -34.6850, -58.7350, 'Barrio Parque San Martín'),
('Pontevedra', 'pontevedra', -34.7450, -58.6950, 'Localidad de Pontevedra, zona sur de Merlo'),
('Mariano Acosta', 'mariano-acosta', -34.7200, -58.7900, 'Localidad de Mariano Acosta'),
('Agustín Ferrari', 'agustin-ferrari', -34.6980, -58.7650, 'Barrio Agustín Ferrari'),
('Pompeya', 'pompeya', -34.6750, -58.7450, 'Barrio Pompeya y Merlo Norte'),
('Santa Marta', 'santa-marta', -34.6920, -58.7180, 'Barrio Santa Marta'),
('Arco Iris', 'arco-iris', -34.6780, -58.7100, 'Barrio Arco Iris'),
('Matera', 'matera', -34.6900, -58.7600, 'Barrio Matera y alrededores'),
('Los Aromos', 'los-aromos', -34.7300, -58.7150, 'Barrio Los Aromos'),
('Rivadavia', 'rivadavia', -34.6880, -58.6990, 'Barrio Rivadavia')
ON CONFLICT (slug) DO NOTHING;

-- SEED DATA: COMPLAINT CATEGORIES
INSERT INTO public.complaint_categories (name, slug, icon, color, description) VALUES
('Alumbrado público', 'alumbrado-publico', 'Lightbulb', '#F59E0B', 'Luminarias apagadas, cables cortados, postes en mal estado'),
('Calles y baches', 'calles-y-baches', 'Construction', '#6C35C7', 'Baches, pozos, calles de tierra anegadas o roturas de pavimento'),
('Recolección de residuos', 'recoleccion-residuos', 'Trash2', '#10B981', 'Falta de recolección, microbasurales, contenedores desbordados'),
('Inundaciones y desagües', 'inundaciones-desagues', 'CloudRain', '#3B82F6', 'Zanjas tapadas, bocas de tormenta obstruidas, calles inundadas'),
('Limpieza y mantenimiento', 'limpieza-mantenimiento', 'Sparkles', '#8B5CF6', 'Poda correctiva, desmalezado de terrenos públicos, veredas obstruidas'),
('Seguridad ciudadana', 'seguridad-ciudadana', 'ShieldAlert', '#EF4444', 'Puntos oscuros peligrosos, falta de patrullaje, cámaras fuera de servicio'),
('Espacios verdes y plazas', 'espacios-verdes', 'Trees', '#059669', 'Juegos infantiles rotos, plazas abandonadas, falta de bancos e iluminación'),
('Tránsito y señalización', 'transito-senalizacion', 'Car', '#6366F1', 'Semáforos rotos, reductores de velocidad, señalética faltante'),
('Transporte público', 'transporte-publico', 'Bus', '#EC4899', 'Refugios de colectivos rotos, frecuencias, paradas sin mantenimiento'),
('Salud', 'salud', 'HeartPulse', '#DC2626', 'Salas de primeros auxilios (CAPS), falta de insumos o guardias'),
('Educación', 'educacion', 'GraduationCap', '#2563EB', 'Accesos a escuelas, infraestructura de jardines y colegios de Merlo'),
('Accesibilidad', 'accesibilidad', 'Accessibility', '#7C3AED', 'Rampas para discapacitados inexistentes o rotas, cruces peatonales'),
('Otros reclamos comunitarios', 'otros', 'HelpCircle', '#64748B', 'Otras problemáticas barriales que afectan a la comunidad de Merlo')
ON CONFLICT (slug) DO NOTHING;
