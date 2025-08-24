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
  PaymentPaginator,
  AdmissionPaymentQueryOptions,
  EnrollmentPaymentPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { hallClient } from './client/hall';
import { paymentClient } from './client/payment';

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

export const useCreateAdmissionPaymentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(paymentClient.admissionPayment, {
    onSuccess: () => {
      Router.push(Routes.admission.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(`${API_ENDPOINTS.PAYMENTS}/students`);
    },
    onError: () => {
      toast.error("Something went wrong!")
    }
  });
};

export const useCreateCoursePaymentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(paymentClient.coursePayment, {
    onSuccess: () => {
      Router.push(Routes.coursePayment.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(`${API_ENDPOINTS.PAYMENTS}/students`);
    },
    onError: () => {
      toast.error("Something went wrong!")
    }
  });
};


export const useAdmissionPaymentsQuery = (params: Partial<AdmissionPaymentQueryOptions>) => {
  const { data, isLoading, error } = useQuery<PaymentPaginator, Error>(
    [`${API_ENDPOINTS.PAYMENTS}/students/admission`, params],
    () => paymentClient.fetchAdmissionPayments(params),
    {
      keepPreviousData: true,
    },
  );

  return {
    payments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useCoursePaymentsQuery = (params: Partial<AdmissionPaymentQueryOptions>) => {
  const { data, isLoading, error } = useQuery<EnrollmentPaymentPaginator, Error>(
    [`${API_ENDPOINTS.PAYMENTS}/students/course`, params],
    () => paymentClient.fetchCoursePayments(params),
    {
      keepPreviousData: true,
    },
  );

  return {
    enrollmentPayments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
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
