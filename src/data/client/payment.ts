import {
  CreateAdmissionPaymentInput,
  AdmissionPaymentQueryOptions,
  PaymentPaginator,
  CreateCoursePaymentInput,
  EnrollmentPaymentPaginator,
  PaymentQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const paymentClient = {
  paginated: ({ name, ...params }: Partial<PaymentQueryOptions>) => {
    return HttpClient.get<PaymentPaginator>(API_ENDPOINTS.PAYMENTS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  admissionPayment: (input: CreateAdmissionPaymentInput) => {
    return HttpClient.post(
      `${API_ENDPOINTS.STUDENTS}/${input.student_id}/payments/admission`,
      input,
    );
  },
  coursePayment: (input: CreateCoursePaymentInput) => {
    return HttpClient.post(
      `${API_ENDPOINTS.STUDENTS}/${input.student_id}/payments/course`,
      input,
    );
  },
  fetchAdmissionPayments: ({
    ...params
  }: Partial<AdmissionPaymentQueryOptions>) => {
    return HttpClient.get<PaymentPaginator>(
      `${API_ENDPOINTS.PAYMENTS}/students/admission`,
      {
        searchJoin: 'and',
        with: 'wallet',
        ...params,
        search: HttpClient.formatSearchParams({}),
      },
    );
  },
  fetchCoursePayments: ({
    ...params
  }: Partial<AdmissionPaymentQueryOptions>) => {
    return HttpClient.get<EnrollmentPaymentPaginator>(
      `${API_ENDPOINTS.PAYMENTS}/students/course`,
      {
        searchJoin: 'and',
        with: 'wallet',
        ...params,
        search: HttpClient.formatSearchParams({}),
      },
    );
  },
};
