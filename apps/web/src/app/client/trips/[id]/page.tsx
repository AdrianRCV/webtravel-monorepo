import { auth } from '@/auth';
import { getTripRequestById } from '@/lib/api';
import { notFound } from 'next/navigation';
import { TripItineraryContent } from './content';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TripItineraryPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  let tripRequest;
  try {
    tripRequest = await getTripRequestById(id, session?.accessToken);
  } catch (err: any) {
    if (err.message?.includes('403') || err.message?.includes('404')) {
      notFound();
    }
    throw err;
  }

  const itinerary = tripRequest.itineraries[0];
  if (!itinerary) {
    notFound();
  }

  return <TripItineraryContent tripRequest={tripRequest} itinerary={itinerary} />;
}
