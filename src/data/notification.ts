import { useMutation, useQuery, useQueryClient } from 'react-query';
import { mapPaginatorData } from '@/utils/data-mappers';
import type { UseQueryOptions } from 'react-query';

import {
  Response,
  StoreNotice,
  StoreNoticePaginator,
  StoreNoticeQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './client/api-endpoints';
import { notificationClient } from './client/notification';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useNotificationQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Response<StoreNotice>, Error>(
    [API_ENDPOINTS.NOTIFICATIONS, { id, language }],
    () => notificationClient.get({ id, language }),
  );

  return {
    notification: data?.data,
    error,
    loading: isLoading,
  };
};

export const useNotificationsQuery = (
  options: Partial<StoreNoticeQueryOptions>,
  config: UseQueryOptions<StoreNoticePaginator, Error> = {},
) => {
  const { data, error, isLoading } = useQuery<StoreNoticePaginator, Error>(
    [API_ENDPOINTS.NOTIFICATIONS, options],
    ({ queryKey, pageParam }) =>
      notificationClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      ...config,
      keepPreviousData: true,
    },
  );

  return {
    notifications: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(notificationClient.notificationSeen, {
    onSuccess: async () => {},
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NOTIFICATION_SEEN);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};
