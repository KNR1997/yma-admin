import {
  CreateAdmissionPaymentInput,
  AdmissionPaymentQueryOptions,
  PaymentPaginator,
  CreateCoursePaymentInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const paymentClient = {
  admissionPayment: (input: CreateAdmissionPaymentInput) => {
    return HttpClient.post(
      `${API_ENDPOINTS.PAYMENTS}/students/admission`,
      input,
    );
  },
  coursePayment: (input: CreateCoursePaymentInput) => {
    return HttpClient.post(
      `${API_ENDPOINTS.PAYMENTS}/students/course`,
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
    return HttpClient.get<PaymentPaginator>(
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
