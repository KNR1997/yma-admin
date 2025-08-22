import {
  CreateGuardianInput,
  Guardian,
  GuardianPaginator,
  GuardianQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const guardianClient = {
  ...crudFactory<Guardian, QueryOptions, CreateGuardianInput>(
    API_ENDPOINTS.GUARDIANS,
  ),
  paginated: ({ name, ...params }: Partial<GuardianQueryOptions>) => {
    return HttpClient.get<GuardianPaginator>(API_ENDPOINTS.GUARDIANS, {
      searchJoin: 'and',
      // self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
