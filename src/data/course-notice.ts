import { useQuery } from 'react-query';
import { storeNoticeClient } from './client/store-notice';

import { CourseNotice, Response, StoreNotice } from '@/types';
import { API_ENDPOINTS } from './client/api-endpoints';
import { courseNoticeClient } from './client/course-notice';

export const useCourseNoticeQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Response<CourseNotice>, Error>(
    [API_ENDPOINTS.COURSE_NOTICES, { id, language }],
    () => courseNoticeClient.get({ id, language }),
  );

  return {
    courseNotice: data?.data,
    error,
    loading: isLoading,
  };
};
