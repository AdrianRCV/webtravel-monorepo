import { auth } from '@/auth';
import { getTripRequests, getUsersCount } from '@/lib/api';
import { HomeContent } from './content';

export default async function Home() {
  const session = await auth();
  const accessToken = session?.accessToken;
  let tripRequests = [];
  let error: string | null = null;
  let usersCount = 0;

  try {
    tripRequests = await getTripRequests(accessToken);
  } catch (err) {
    console.error('Error al obtener solicitudes:', err);
    error = 'No se pudo conectar con el servidor';
  }

  try {
    usersCount = await getUsersCount(accessToken);
  } catch (err) {
    console.error('Error al obtener el número de usuarios:', err);
  }

  const pendingCount = tripRequests.filter((req) => req.status === 'PENDING').length;
  const latestRequests = tripRequests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <HomeContent
      tripRequests={latestRequests}
      pendingCount={pendingCount}
      usersCount={usersCount}
      error={error}
      session={session}
    />
  );
}
