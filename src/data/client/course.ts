import {
  CorusePaginator,
  CoruseTopicPaginator,
  Course,
  CourseQueryOptions,
  CreateCourseInput,
  CreateCourseTopicInput,
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
  availableCoursesForStudent: ({
    name,
    student_id,
    ...params
  }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CorusePaginator>(
      `${API_ENDPOINTS.COURSES}/${student_id}/available-courses`,
      {
        searchJoin: 'and',
        // self,
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
  createOrUpdateCourseTopics: ({
    course_id,
    ...input
  }: Partial<CreateCourseTopicInput>) => {
    return HttpClient.post(
      `${API_ENDPOINTS.COURSES}/${course_id}/topics`,
      input,
    );
  },
  courseTopticPaginated: ({ courseId }: { courseId: string }) => {
    return HttpClient.get<CoruseTopicPaginator>(
      `${API_ENDPOINTS.COURSES}/${courseId}/topics`,
      {
        searchJoin: 'and',
        // self,
        // ...params,
        // search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
};
