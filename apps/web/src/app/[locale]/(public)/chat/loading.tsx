import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
