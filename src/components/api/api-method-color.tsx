import { ApiMethodType } from '@/types';

const ApiMethodColor = (method: ApiMethodType) => {
  let statusColor = '';

  if (method === ApiMethodType.GET) {
    // Blue - safe/read-only
    statusColor = 'bg-blue-500/10 text-blue-500';
  } else if (method === ApiMethodType.POST) {
    // Green - creates data
    statusColor = 'bg-green-500/10 text-green-600';
  } else if (method === ApiMethodType.PUT) {
    // Yellow - updates data
    statusColor = 'bg-yellow-400/10 text-yellow-500';
  } else if (method === ApiMethodType.DELETE) {
    // Red - deletes data
    statusColor = 'bg-red-500/10 text-red-500';
  } else {
    // Fallback color (e.g. PATCH, OPTIONS, etc.)
    statusColor = 'bg-gray-500/10 text-gray-500';
  }

  return statusColor;
};

export default ApiMethodColor;
