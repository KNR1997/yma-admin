import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CorusePaginator,
  CourseQueryOptions,
  GetParams,
  Response,
  Student,
  StudentPaginator,
  StudentQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { studentClient } from './client/student';

export const useCreateStudentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(studentClient.create, {
    onSuccess: () => {
      Router.push(Routes.student.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STUDENTS);
    },
    // onError: () => {
    //   toast.error('Something went wrong!');
    // }
  });
};

export const useDeleteStudentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(studentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STUDENTS);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useUpdateStudentMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(studentClient.update, {
    onSuccess: async (data: any) => {
      const generateRedirectUrl = Routes.student.list;
      await router.push(`${generateRedirectUrl}/${data?.id}/edit`);
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STUDENTS);
    },
    // onError: () => {
    //   toast.error('Something went wrong!');
    // }
  });
};

export const useStudentQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Student, Error>(
    [API_ENDPOINTS.STUDENTS, { slug, language }],
    () => studentClient.get({ slug, language }),
  );

  return {
    student: data,
    error,
    isLoading,
  };
};

export const useStudentsQuery = (options: Partial<StudentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<StudentPaginator, Error>(
    [API_ENDPOINTS.STUDENTS, options],
    ({ queryKey, pageParam }) =>
      studentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    students: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useStudentAvailableCoursesQuery = (
  options: Partial<CourseQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<CorusePaginator, Error>(
    [API_ENDPOINTS.COURSES, options],
    ({ queryKey, pageParam }) =>
      studentClient.availableCourses(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      enabled: !!options.student_id, // prevent fetch when studentId is undefined
    },
  );

  return {
    courses: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};


export const useStudentEnrolledCoursesQuery = (
  options: Partial<CourseQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<CorusePaginator, Error>(
    [API_ENDPOINTS.COURSES, options],
    ({ queryKey, pageParam }) =>
      studentClient.studentEnrolledCourses(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      keepPreviousData: true,
      enabled: !!options.student_id, // prevent fetch when studentId is undefined
    },
  );

  return {
    courses: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
