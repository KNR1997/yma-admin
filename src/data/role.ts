import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Api,
  GetParams,
  Response,
  Role,
  RolePaginator,
  RoleQueryOptions,
  RolesAuthorizedResponse,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { roleClient } from './client/role';

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(roleClient.create, {
    onSuccess: () => {
      Router.push(Routes.role.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROLES);
    },
    onError: () => {
      toast.error("Something went wrong!")
    }
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(roleClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROLES);
    },
  });
};

export const useUpdateRoleMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(roleClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.role.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROLES);
    },
  });
};

export const useRoleQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Response<Role>, Error>(
    [API_ENDPOINTS.ROLES, { slug }],
    () => roleClient.get({ slug }),
  );

  return {
    role: data?.data,
    error,
    loading: isLoading,
  };
};

export const useRolesQuery = (options: Partial<RoleQueryOptions>) => {
  const { data, error, isLoading } = useQuery<RolePaginator, Error>(
    [API_ENDPOINTS.ROLES, options],
    ({ queryKey, pageParam }) =>
      roleClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    roles: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useRoleAuthorizedQuery = ({ id }: GetParams) => {
  const { data, error, isLoading } = useQuery<
    Response<Api[]>,
    Error
  >([`${API_ENDPOINTS.ROLES}/authorized`, { id }], () =>
    roleClient.authorized({ id }),
  );

  return {
    data: data?.data,
    error,
    loading: isLoading,
  };
};

export const useUpdateRoleAuthorizedMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(roleClient.authorizedUpdate, {
    onSuccess: async (data) => {
      await router.push(Routes.role.list);
      // toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROLES);
    },
  });
};
