import {
  CreateHallInput,
  Hall,
  HallPaginator,
  HallQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const hallClient = {
  ...crudFactory<Hall, QueryOptions, CreateHallInput>(
    API_ENDPOINTS.HALLS
  ),
  paginated: ({ name, ...params }: Partial<HallQueryOptions>) => {
    return HttpClient.get<HallPaginator>(API_ENDPOINTS.HALLS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
