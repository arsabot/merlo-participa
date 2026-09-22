import { ImageResponse } from 'next/og';

export const alt = 'Merlo Participa | Portal Vecinal y Participación Ciudadana';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#041322',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(14, 90, 157, 0.45) 0%, rgba(4, 19, 34, 0.95) 70%), linear-gradient(135deg, #041322 0%, #07233E 50%, #030E1B 100%)',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          color: 'white',
          border: '10px solid #0B4F8A',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '999px',
              padding: '10px 22px',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#38BDF8',
                boxShadow: '0 0 12px #38BDF8',
              }}
            />
            <span
              style={{
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#E0F2FE',
              }}
            >
              Portal Ciudadano Independiente
            </span>
          </div>

          {/* Location Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(11, 79, 138, 0.4)',
              border: '1px solid rgba(186, 230, 253, 0.25)',
              borderRadius: '14px',
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#BAE6FD',
              gap: '8px',
            }}
          >
            📍 Partido de Merlo, Buenos Aires
          </div>
        </div>

        {/* Main Content with Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', margin: '20px 0' }}>
          {/* Logo Mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #0E5A9D 0%, #062544 100%)',
              border: '2.5px solid #38BDF8',
              boxShadow: '0 12px 35px rgba(2, 132, 199, 0.35)',
              flexShrink: 0,
            }}
          >
            {/* SVG Logo Mark Inside OG */}
            <svg width="74" height="74" viewBox="0 0 512 512" fill="none">
              <path
                d="M256 75 C176 75 112 139 112 220 C112 320 256 430 256 430 C256 430 400 320 400 220 C400 139 336 75 256 75 Z"
                fill="#FFFFFF"
              />
              <circle cx="256" cy="216" r="66" fill="#062544" />
              <circle cx="256" cy="216" r="26" fill="#38BDF8" />
              <path
                d="M176 316 L216 190 L256 244 L296 190 L336 316"
                stroke="#38BDF8"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1
              style={{
                fontSize: '66px',
                fontWeight: 900,
                letterSpacing: '-2px',
                margin: 0,
                lineHeight: 1.05,
                color: '#FFFFFF',
              }}
            >
              Merlo<span style={{ color: '#38BDF8' }}>Participa</span>
            </h1>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 500,
                color: '#BAE6FD',
                margin: 0,
                maxWidth: '900px',
                lineHeight: 1.35,
              }}
            >
              La plataforma comunitaria para visibilizar reclamos de baches, luminarias, cloacas y seguridad, sumando propuestas vecinales para transformar cada barrio.
            </p>
          </div>
        </div>

        {/* 3 Pillars Glassmorphism Cards */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'rgba(11, 79, 138, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              padding: '14px 18px',
              gap: '4px',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#38BDF8' }}>
              📢 Reportes Vecinales
            </div>
            <div style={{ fontSize: '12px', color: '#E0F2FE' }}>
              Carga tu reclamo con foto y geolocalización en 5 pasos.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'rgba(11, 79, 138, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              padding: '14px 18px',
              gap: '4px',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#38BDF8' }}>
              🗺️ Mapa Interactivo
            </div>
            <div style={{ fontSize: '12px', color: '#E0F2FE' }}>
              Explorá todas las incidencias de Merlo en tiempo real.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'rgba(11, 79, 138, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              padding: '14px 18px',
              gap: '4px',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#38BDF8' }}>
              ⚡ Seguimiento Digital
            </div>
            <div style={{ fontSize: '12px', color: '#E0F2FE' }}>
              Código único para monitorear cada avance del trámite.
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(56, 189, 248, 0.2)',
            paddingTop: '16px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: '0.5px',
            }}
          >
            merlo-participa.vercel.app
          </div>

          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#94A3B8',
            }}
          >
            🤝 Impulsado por la Comunidad de Vecinos de Merlo
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
