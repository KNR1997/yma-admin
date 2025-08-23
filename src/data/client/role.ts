import {
  Api,
  CreateRoleInput,
  GetParams,
  QueryOptions,
  Response,
  Role,
  RolePaginator,
  RoleQueryOptions,
  RolesAuthorizedResponse,
  UpdateRolesAuthorizeInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const roleClient = {
  ...crudFactory<Role, QueryOptions, CreateRoleInput>(API_ENDPOINTS.ROLES),
  paginated: ({ name, ...params }: Partial<RoleQueryOptions>) => {
    return HttpClient.get<RolePaginator>(API_ENDPOINTS.ROLES, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  authorized: ({ id }: GetParams) => {
    return HttpClient.get<Response<Api[]>>(
      `${API_ENDPOINTS.ROLES}/${id}/authorized`,
    );
  },
  authorizedUpdate: ({
    role_id,
    ...input
  }: Partial<UpdateRolesAuthorizeInput> & { role_id: number }) => {
    return HttpClient.post<Response<RolesAuthorizedResponse>>(
      `${API_ENDPOINTS.ROLES}/${role_id}/authorized`,
      input,
    );
  },
};
