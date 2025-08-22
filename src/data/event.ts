import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Response,
  EventQueryOptions,
  EventPaginator,
  Event,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { eventClient } from './client/event';

export const useEventsQuery = (options: Partial<EventQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EventPaginator, Error>(
    [API_ENDPOINTS.EVENTS, options],
    ({ queryKey, pageParam }) =>
      eventClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    events: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useEventQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Response<Event>, Error>(
    [API_ENDPOINTS.EVENTS, { slug, language }],
    () => eventClient.get({ slug, language }),
  );

  return {
    event: data?.data,
    error,
    isLoading,
  };
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(eventClient.create, {
    onSuccess: () => {
      Router.push(Routes.event.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EVENTS);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useUpdateEventMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(eventClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.event.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EVENTS);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(eventClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EVENTS);
    },
  });
};
