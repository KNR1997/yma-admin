import {
  CreateEnrollmentInput,
  Enrollment,
  EnrollmentPaginator,
  EnrollmentPaymentPaginator,
  EnrollmentQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const enrollmentClient = {
  ...crudFactory<Enrollment, QueryOptions, CreateEnrollmentInput>(
    API_ENDPOINTS.ENROLLMENTS,
  ),
  paginated: ({ ...params }: Partial<EnrollmentQueryOptions>) => {
    return HttpClient.get<EnrollmentPaginator>(API_ENDPOINTS.ENROLLMENTS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({}),
    });
  },
  enrollmentPaymentsPaginated: ({ enrollmentId }: { enrollmentId: string }) => {
    return HttpClient.get<EnrollmentPaymentPaginator>(
      `${API_ENDPOINTS.ENROLLMENTS}/${enrollmentId}/payments`,
      {
        searchJoin: 'and',
        // self,
        // ...params,
        // search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
};
