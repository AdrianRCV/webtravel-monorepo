import { auth } from '@/auth';
import { ItinerariosContent } from './content';

export default async function ItinerariosPage() {
  const session = await auth();
  
  return <ItinerariosContent session={session} />;
}
