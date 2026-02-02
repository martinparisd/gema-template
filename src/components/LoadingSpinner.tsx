import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading your medical practice...</p>
      </div>
    </div>
  );
}
