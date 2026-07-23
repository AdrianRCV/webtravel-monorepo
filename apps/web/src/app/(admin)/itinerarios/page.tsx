import { auth } from '@/auth';
import { ItinerariosContent } from './content';

export default async function ItinerariosPage() {
  const session = await auth();
  const accessToken = session?.accessToken;
  
  return <ItinerariosContent session={session} accessToken={accessToken} />;
}
