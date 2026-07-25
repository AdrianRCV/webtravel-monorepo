import { auth } from '@/auth';
import { getTripRequests, getUsersCount, getDashboardStats, type DashboardStats } from '@/lib/api';
import { HomeContent } from './content';

const EMPTY_STATS: DashboardStats = {
  activeItinerariesCount: 0,
  requestsByStatus: {
    PENDING: 0,
    IN_PROGRESS: 0,
    PROPOSED: 0,
    APPROVED: 0,
    REJECTED: 0,
  },
  newRequestsLast7Days: 0,
  newUsersLast7Days: 0,
};

export default async function Home() {
  const session = await auth();
  const accessToken = session?.accessToken;
  let tripRequests = [];
  let error: string | null = null;
  let usersCount = 0;
  let stats = EMPTY_STATS;

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

  try {
    stats = await getDashboardStats(accessToken);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
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
      stats={stats}
      error={error}
      session={session}
    />
  );
}
