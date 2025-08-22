import {
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
    return HttpClient.get<Response<RolesAuthorizedResponse>>(
      `${API_ENDPOINTS.ROLES}/${id}/authorized`,
    );
  },
  authorizedUpdate: ({
    roleId,
    ...input
  }: Partial<UpdateRolesAuthorizeInput> & { roleId: string }) => {
    return HttpClient.post<Response<RolesAuthorizedResponse>>(
      `${API_ENDPOINTS.ROLES}/${roleId}/authorized`,
      input,
    );
  },
};
