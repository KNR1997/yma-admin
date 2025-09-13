import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Response,
  Subject,
  SubjectPaginator,
  SubjectQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { subjectClient } from './client/subject';
import { getErrorMessage } from '@/utils/form-error';

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(subjectClient.create, {
    onSuccess: () => {
      Router.push(Routes.subject.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBJECTS);
    },
    // onError: (error: any) => {
    //   toast.error(error?.response?.data.error ?? "Something went wrong!");
    // }
  });
};

export const useDeleteSubjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(subjectClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBJECTS);
    },
    onError: (error: any) => {
      toast.error("Something went wrong!")
    }
  });
};

export const useUpdateSubjectMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(subjectClient.update, {
    onSuccess: async (data) => {
      await router.push(Routes.subject.list);
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUBJECTS);
    },
    // onError: () => {
    //   toast.error("Something went wrong!")
    // }
  });
};

export const useSubjectQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Subject, Error>(
    [API_ENDPOINTS.SUBJECTS, { slug, language }],
    () => subjectClient.get({ slug, language })
  );

  return {
    subject: data,
    error,
    isLoading,
  };
};

export const useSubjectsQuery = (options: Partial<SubjectQueryOptions>) => {
  const { data, error, isLoading } = useQuery<SubjectPaginator, Error>(
    [API_ENDPOINTS.SUBJECTS, options],
    ({ queryKey, pageParam }) =>
      subjectClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    subjects: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
