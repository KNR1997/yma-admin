import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Response,
  EnrollmentQueryOptions,
  EnrollmentPaginator,
  Enrollment,
  EnrollmentPaymentPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { enrollmentClient } from './client/enrollment';

export const useEnrollmentsQuery = (options: Partial<EnrollmentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EnrollmentPaginator, Error>(
    [API_ENDPOINTS.ENROLLMENTS, options],
    ({ queryKey, pageParam }) =>
      enrollmentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    enrollments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useEnrollmentQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Response<Enrollment>, Error>(
    [API_ENDPOINTS.ENROLLMENTS, { slug, language }],
    () => enrollmentClient.get({ slug, language }),
  );

  return {
    enrollment: data?.data,
    error,
    isLoading,
  };
};

export const useCreateEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(enrollmentClient.create, {
    onSuccess: () => {
      Router.push(Routes.enrollment.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENTS);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useUpdateEnrollmentMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(enrollmentClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.hall.list);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENTS);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useDeleteEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(enrollmentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENTS);
    },
  });
};

export const useEnrollmentPaymentsQuery = (enrollmentId: string) => {
  const { data, error, isLoading } = useQuery<EnrollmentPaymentPaginator, Error>(
    [`${API_ENDPOINTS.ENROLLMENTS}/${enrollmentId}/payments`],
    ({ queryKey, pageParam }) =>
      enrollmentClient.enrollmentPaymentsPaginated({enrollmentId: enrollmentId}),
    {
      keepPreviousData: true,
    },
  );

  return {
    enrollmentPayments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
