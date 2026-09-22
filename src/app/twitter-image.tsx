import { ImageResponse } from 'next/og';

export const alt = 'Merlo Participa | Portal Vecinal y Participación Ciudadana';
export const size = {
  width: 1200,
  height: 600,
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
          padding: '44px 55px',
          fontFamily: 'sans-serif',
          color: 'white',
          border: '10px solid #0B4F8A',
          boxSizing: 'border-box',
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
              padding: '8px 20px',
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
                fontSize: '14px',
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
              borderRadius: '12px',
              padding: '8px 18px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#BAE6FD',
              gap: '6px',
            }}
          >
            📍 Partido de Merlo, Bs. As.
          </div>
        </div>

        {/* Main Content with Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', margin: '12px 0' }}>
          {/* Logo Mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '105px',
              height: '105px',
              borderRadius: '26px',
              background: 'linear-gradient(135deg, #0E5A9D 0%, #062544 100%)',
              border: '2px solid #38BDF8',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 512 512" fill="none">
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h1
              style={{
                fontSize: '58px',
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
                fontSize: '19px',
                fontWeight: 500,
                color: '#BAE6FD',
                margin: 0,
                maxWidth: '880px',
                lineHeight: 1.35,
              }}
            >
              La plataforma ciudadana para visibilizar reclamos barriales, sumar propuestas comunitarias y transformar juntos cada barrio de Merlo.
            </p>
          </div>
        </div>

        {/* 3 Pillars Glassmorphism Cards */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'rgba(11, 79, 138, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              padding: '12px 16px',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>
              📢 Reportes Vecinales
            </div>
            <div style={{ fontSize: '11px', color: '#E0F2FE' }}>
              Reclamos con fotos y ubicación exacta.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'rgba(11, 79, 138, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              padding: '12px 16px',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>
              🗺️ Mapa Interactivo
            </div>
            <div style={{ fontSize: '11px', color: '#E0F2FE' }}>
              Todas las incidencias en tiempo real.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: 'rgba(11, 79, 138, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              padding: '12px 16px',
              gap: '2px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>
              ⚡ Seguimiento Digital
            </div>
            <div style={{ fontSize: '11px', color: '#E0F2FE' }}>
              Código único para monitorear avances.
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
            paddingTop: '14px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: '0.5px',
            }}
          >
            merlo-participa.vercel.app
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#94A3B8',
            }}
          >
            🤝 Impulsado por la Comunidad de Vecinos
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
