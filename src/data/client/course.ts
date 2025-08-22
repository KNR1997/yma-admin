import {
  CorusePaginator,
  Course,
  CourseQueryOptions,
  CreateCourseInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const courseClient = {
  ...crudFactory<Course, QueryOptions, CreateCourseInput>(
    API_ENDPOINTS.COURSES,
  ),
  paginated: ({ name, ...params }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CorusePaginator>(API_ENDPOINTS.COURSES, {
      searchJoin: 'and',
      // self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  enable: ({ id }: { id: string }) => {
    return HttpClient.post(`${API_ENDPOINTS.COURSES}/${id}/enable`, {});
  },
  disable: ({ id }: { id: string }) => {
    return HttpClient.post(`${API_ENDPOINTS.COURSES}/${id}/disable`, {});
  },
  availableCoursesForStudent: ({ name, student_id, ...params }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CorusePaginator>(`${API_ENDPOINTS.COURSES}/${student_id}/available-courses`, {
      searchJoin: 'and',
      // self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  studentEnrolledCourses: ({ name, student_id, ...params }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CorusePaginator>(`${API_ENDPOINTS.COURSES}/${student_id}/enrolled-courses`, {
      searchJoin: 'and',
      // self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
