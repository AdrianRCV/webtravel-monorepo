import { auth } from '@/auth';
import { getTripRequests } from '@/lib/api';
import { HomeContent } from './content';

export default async function Home() {
  const session = await auth();
  let tripRequests = [];
  let error: string | null = null;

  try {
    tripRequests = await getTripRequests();
  } catch (err) {
    console.error('Error al obtener solicitudes:', err);
    error = 'No se pudo conectar con el servidor';
  }

  const pendingCount = tripRequests.filter((req) => req.status === 'PENDING').length;
  const latestRequests = tripRequests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <HomeContent 
      tripRequests={latestRequests} 
      pendingCount={pendingCount} 
      error={error} 
      session={session} 
    />
  );
}
