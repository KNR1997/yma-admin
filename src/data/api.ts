import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Api,
  ApiPaginator,
  ApiQueryOptions,
  GetParams,
  Response,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { apiClient } from './client/api';

export const useCreateApiMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(apiClient.create, {
    onSuccess: () => {
      Router.push(Routes.api.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APIS);
    },
  });
};

export const useDeleteApiMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(apiClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APIS);
    },
  });
};

export const useUpdateApiMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(apiClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.api.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APIS);
    },
  });
};

export const useApiQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Response<Api>, Error>(
    [API_ENDPOINTS.APIS, { slug }],
    () => apiClient.get({ slug }),
  );

  return {
    api: data?.data,
    error,
    loading: isLoading,
  };
};

export const useApisQuery = (options: Partial<ApiQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ApiPaginator, Error>(
    [API_ENDPOINTS.APIS, options],
    ({ queryKey, pageParam }) =>
      apiClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    apis: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
