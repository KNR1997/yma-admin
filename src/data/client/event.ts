import {
  CreateEventInput,
  Event,
  EventPaginator,
  EventQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const eventClient = {
  ...crudFactory<Event, QueryOptions, CreateEventInput>(API_ENDPOINTS.EVENTS),
  paginated: ({ event_type, ...params }: Partial<EventQueryOptions>) => {
    return HttpClient.get<EventPaginator>(API_ENDPOINTS.EVENTS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({}),
    });
  },
};
