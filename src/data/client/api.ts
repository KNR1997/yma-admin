import {
  Api,
  CreateApiInput,
  QueryOptions,
  RolePaginator,
  RoleQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const apiClient = {
  ...crudFactory<Api, QueryOptions, CreateApiInput>(
    API_ENDPOINTS.APIS
  ),
  // paginated: ({ name, ...params }: Partial<RoleQueryOptions>) => {
  //   return HttpClient.get<RolePaginator>(API_ENDPOINTS.ROLES, {
  //     searchJoin: 'and',
  //     self,
  //     ...params,
  //     search: HttpClient.formatSearchParams({ name }),
  //   });
  // },
};
