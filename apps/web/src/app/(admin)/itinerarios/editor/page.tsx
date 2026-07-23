import { auth } from '@/auth';
import { ItineraryEditorContent } from './content';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    tripRequestId?: string;
    itineraryId?: string;
  }>;
}

export default async function ItineraryEditorPage({ searchParams }: PageProps) {
  const session = await auth();
  const accessToken = session?.accessToken;
  const params = await searchParams;
  const { tripRequestId, itineraryId } = params;

  if (!tripRequestId) {
    notFound();
  }

  return <ItineraryEditorContent tripRequestId={tripRequestId} itineraryId={itineraryId} accessToken={accessToken} />;
}
