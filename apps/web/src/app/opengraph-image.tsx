import { ImageResponse } from 'next/og';

export const alt = 'YourAgencyToday — Tu próximo viaje, diseñado a medida';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #042f2e 0%, #0f172a 50%, #1e1b4b 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, display: 'flex' }}>
          ✈️ YourAgencyToday
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#99f6e4', display: 'flex' }}>
          Tu próximo viaje, diseñado a medida por expertos
        </div>
      </div>
    ),
    { ...size },
  );
}
