import { auth } from '@/auth';
import { getTripRequests } from '@/lib/api';
import { SolicitudesContent } from './content';

export default async function SolicitudesPage() {
  const session = await auth();
  let tripRequests = [];
  let error: string | null = null;

  try {
    tripRequests = await getTripRequests();
    tripRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error al obtener solicitudes:', err);
    error = 'No se pudo conectar con el servidor';
  }

  return <SolicitudesContent tripRequests={tripRequests} error={error} session={session} />;
}
