import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { AuditLogQueryOptions, AudtiLogPaginator } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { audtiLogClient } from './client/auditLog';

export const useAudtiLogsQuery = (options: Partial<AuditLogQueryOptions>) => {
  const { data, error, isLoading } = useQuery<AudtiLogPaginator, Error>(
    [API_ENDPOINTS.AUDITLOGS, options],
    ({ queryKey, pageParam }) =>
      audtiLogClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    auditLogs: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
