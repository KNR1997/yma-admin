import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CorusePaginator,
  CoruseTopicPaginator,
  Course,
  CourseQueryOptions,
  GetParams,
  Response,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { courseClient } from './client/course';

export const useCoursesQuery = (options: Partial<CourseQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CorusePaginator, Error>(
    [API_ENDPOINTS.COURSES, options],
    ({ queryKey, pageParam }) =>
      courseClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    courses: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCourseQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Response<Course>, Error>(
    [API_ENDPOINTS.COURSES, { slug }],
    () => courseClient.get({ slug }),
  );

  return {
    course: data?.data,
    error,
    isLoading,
  };
};

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.create, {
    onSuccess: () => {
      Router.push(Routes.course.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useUpdateCourseMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(courseClient.update, {
    onSuccess: async (data: any) => {
      const generateRedirectUrl = Routes.course.list;
      await router.push(`${generateRedirectUrl}/${data?.data?.id}/edit`);
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
  });
};

export const useEnableCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.enable, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
  });
};

export const useDisableCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.disable, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
  });
};

export const useCoursesAvailableForStudentQuery = (
  options: Partial<CourseQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<CorusePaginator, Error>(
    [API_ENDPOINTS.COURSES, options],
    ({ queryKey, pageParam }) =>
      courseClient.availableCoursesForStudent(
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

export const useStudentEnrolledCoursesQuery = (
  options: Partial<CourseQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<CorusePaginator, Error>(
    [API_ENDPOINTS.COURSES, options],
    ({ queryKey, pageParam }) =>
      courseClient.studentEnrolledCourses(
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

export const useCreateOrUpdateCourseTopicsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.createOrUpdateCourseTopics, {
    onSuccess: () => {
      // Router.push(Routes.course.list, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
    onError: (error: any) => {
      toast.error('Something went wrong!');
    },
  });
};

export const useCourseTopicsQuery = (courseId: string) => {
  const { data, error, isLoading } = useQuery<CoruseTopicPaginator, Error>(
    [`${API_ENDPOINTS.COURSES}/${courseId}/topics`],
    ({ queryKey, pageParam }) =>
      courseClient.courseTopticPaginated({courseId: courseId}),
    {
      keepPreviousData: true,
    },
  );

  return {
    courseTopics: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
