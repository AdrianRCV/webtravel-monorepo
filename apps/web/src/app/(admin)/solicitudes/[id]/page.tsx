import { auth } from '@/auth';
import { getTripRequestById } from '@/lib/api';
import { TripRequestDetailContent } from './content';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TripRequestDetailPage({ params }: PageProps) {
  const session = await auth();
  const accessToken = session?.accessToken;
  const { id } = await params;
  let tripRequest = null;
  let error: string | null = null;

  try {
    tripRequest = await getTripRequestById(id, accessToken);
  } catch (err: any) {
    console.error('Error al obtener solicitud:', err);
    
    if (err.message?.includes('404')) {
      notFound();
    }
    
    error = 'No se pudo conectar con el servidor';
  }

  if (!tripRequest && !error) {
    notFound();
  }

  return (
    <TripRequestDetailContent 
      tripRequest={tripRequest} 
      error={error} 
      session={session} 
      accessToken={accessToken}
    />
  );
}
