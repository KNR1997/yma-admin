import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Hall,
  GetParams,
  HallPaginator,
  HallQueryOptions,
  Response,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { hallClient } from './client/hall';

export const useHallsQuery = (options: Partial<HallQueryOptions>) => {
  const { data, error, isLoading } = useQuery<HallPaginator, Error>(
    [API_ENDPOINTS.HALLS, options],
    ({ queryKey, pageParam }) =>
      hallClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    halls: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useHallQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Response<Hall>, Error>(
    [API_ENDPOINTS.HALLS, { slug, language }],
    () => hallClient.get({ slug, language }),
  );

  return {
    hall: data?.data,
    error,
    isLoading,
  };
};

export const useCreateHallMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(hallClient.create, {
    onSuccess: () => {
      Router.push(Routes.hall.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HALLS);
    },
    onError: () => {
      toast.error("Something went wrong!")
    }
  });
};

export const useUpdateHallMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(hallClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.hall.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HALLS);
    },
    onError: () => {
      toast.error("Something went wrong!")
    }
  });
};

export const useDeleteHallMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(hallClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HALLS);
    },
  });
};
