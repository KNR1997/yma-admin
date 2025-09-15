import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Guardian,
  GuardianPaginator,
  GuardianQueryOptions,
  Response,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { guardianClient } from './client/guardian';

export const useGuardiansQuery = (options: Partial<GuardianQueryOptions>) => {
  const { data, error, isLoading } = useQuery<GuardianPaginator, Error>(
    [API_ENDPOINTS.GUARDIANS, options],
    ({ queryKey, pageParam }) =>
      guardianClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    guardians: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useGuardianQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Guardian, Error>(
    [API_ENDPOINTS.GUARDIANS, { slug, language }],
    () => guardianClient.get({ slug, language }),
  );

  return {
    guardian: data,
    error,
    isLoading,
  };
};

export const useCreateGuardianMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(guardianClient.create, {
    onSuccess: () => {
      Router.push(Routes.guardian.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GUARDIANS);
    },
    // onError: () => {
    //   toast.error("Something went wrong!")
    // }
  });
};

export const useUpdateGuardianMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(guardianClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.guardian.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GUARDIANS);
    },
    // onError: () => {
    //   toast.error("Something went wrong!")
    // }
  });
};

export const useDeleteGuardianMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(guardianClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GUARDIANS);
    },
  });
};
