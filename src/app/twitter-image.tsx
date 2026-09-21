import { ImageResponse } from 'next/og';

export const alt = 'Merlo Participa | Portal Vecinal Independiente';
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
          backgroundColor: '#072C4F',
          backgroundImage: 'radial-gradient(circle at 90% 15%, #0B4F8A 0%, #072C4F 60%, #03182B 100%)',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          color: 'white',
          border: '10px solid #0B4F8A',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
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
              }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#E0F2FE',
              }}
            >
              Portal Vecinal Independiente
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#0B4F8A',
              borderRadius: '12px',
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#F0F9FF',
              border: '1px solid rgba(56, 189, 248, 0.4)',
            }}
          >
            Merlo Participa
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1
              style={{
                fontSize: '70px',
                fontWeight: 900,
                letterSpacing: '-2px',
                margin: 0,
                lineHeight: 1,
                color: '#FFFFFF',
              }}
            >
              Merlo<span style={{ color: '#38BDF8' }}>Participa</span>
            </h1>
          </div>
          
          <p
            style={{
              fontSize: '25px',
              fontWeight: 500,
              color: '#BAE6FD',
              margin: 0,
              maxWidth: '880px',
              lineHeight: 1.35,
            }}
          >
            Plataforma ciudadana para reportar problemáticas barriales, reclamos de infraestructura y propuestas vecinales en Merlo.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(186, 230, 253, 0.2)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(11, 79, 138, 0.7)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#F0F9FF',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              📢 Reclamos
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(11, 79, 138, 0.7)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#F0F9FF',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              🗺️ Mapa Comunitario
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(11, 79, 138, 0.7)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#F0F9FF',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              🤝 Proyecto de Vecinos
            </div>
          </div>

          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#E0F2FE',
              letterSpacing: '0.5px',
            }}
          >
            merlo-participa.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
