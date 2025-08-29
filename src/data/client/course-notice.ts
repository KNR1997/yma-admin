import {
  CourseNotice,
  CourseNoticeInput,
  Response,
  StoreNotice,
  StoreNoticeInput,
  StoreNoticePaginator,
  StoreNoticeQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const courseNoticeClient = {
  ...crudFactory<CourseNotice, any, CourseNoticeInput>(
    API_ENDPOINTS.COURSE_NOTICES,
  ),
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<Response<CourseNotice>>(
      `${API_ENDPOINTS.COURSE_NOTICES}/${id}`,
      {
        language,
      },
    );
  },
};
