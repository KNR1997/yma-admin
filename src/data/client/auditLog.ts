import { AuditLogQueryOptions, AudtiLogPaginator } from "@/types";
import { HttpClient } from "./http-client";
import { API_ENDPOINTS } from "./api-endpoints";

export const audtiLogClient = {
paginated: ({ ...params }: Partial<AuditLogQueryOptions>) => {
    return HttpClient.get<AudtiLogPaginator>(API_ENDPOINTS.AUDITLOGS, {
      searchJoin: 'and',
      with: 'wallet',
      ...params,
      search: HttpClient.formatSearchParams({  }),
    });
  },
}