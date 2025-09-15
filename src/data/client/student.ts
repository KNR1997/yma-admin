import {
  CorusePaginator,
  CourseQueryOptions,
  CreateStudentInput,
  QueryOptions,
  Student,
  StudentPaginator,
  StudentQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const studentClient = {
  ...crudFactory<Student, QueryOptions, CreateStudentInput>(
    API_ENDPOINTS.STUDENTS,
  ),
  paginated: ({ name, ...params }: Partial<StudentQueryOptions>) => {
    return HttpClient.get<StudentPaginator>(API_ENDPOINTS.STUDENTS, {
      searchJoin: 'and',
      // self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  availableCourses: ({
    name,
    student_id,
    ...params
  }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CorusePaginator>(
      `${API_ENDPOINTS.STUDENTS}/${student_id}/available-courses`,
      {
        searchJoin: 'and',
        // self,
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
  studentEnrolledCourses: ({
    name,
    student_id,
    ...params
  }: Partial<CourseQueryOptions>) => {
    return HttpClient.get<CorusePaginator>(
      `${API_ENDPOINTS.STUDENTS}/${student_id}/enrolled-courses`,
      {
        searchJoin: 'and',
        // self,
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
};
