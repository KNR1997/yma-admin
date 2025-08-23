import { Analytics, Product, ProductQueryOptions, Response } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient } from '@/data/client/dashboard';
import { productClient } from '@/data/client/product';

export const useAnalyticsQuery = () => {
  const { data, error, isLoading } = useQuery<Response<Analytics>, Error>(
    [API_ENDPOINTS.ANALYTICS],
    () => dashboardClient.analytics(),
    {
      staleTime: 1000 * 60 * 60, // ✅ optional: cache for 1 hour
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
  // return useQuery([API_ENDPOINTS.ANALYTICS], dashboardClient.analytics);
}

export function usePopularProductsQuery(options: Partial<ProductQueryOptions>) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      productClient.popular(Object.assign({}, pageParam, queryKey[1])),
  );
}

export function useLowProductStockQuery(options: Partial<ProductQueryOptions>) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.LOW_STOCK_PRODUCTS_ANALYTICS, options],
    ({ queryKey, pageParam }) =>
      productClient.lowStock(Object.assign({}, pageParam, queryKey[1])),
  );
}

export function useProductByCategoryQuery({
  limit,
  language,
}: {
  limit?: number;
  language?: string;
}) {
  return useQuery(
    [API_ENDPOINTS.CATEGORY_WISE_PRODUCTS, { limit, language }],
    () => productClient.productByCategory({ limit, language }),
    {
      keepPreviousData: false,
    },
  );
}

// export function useProductByCategoryQuery(
//   options: Partial<ProductQueryOptions>
// ) {
//   return useQuery<Product[], Error>(
//     [API_ENDPOINTS.CATEGORY_WISE_PRODUCTS, options],
//     ({ queryKey, pageParam }) =>
//       productClient.productByCategory(Object.assign({}, pageParam, queryKey[1]))
//   );
// }

export function useMostSoldProductByCategoryQuery(
  options: Partial<ProductQueryOptions>,
) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.CATEGORY_WISE_PRODUCTS_SALE, options],
    ({ queryKey, pageParam }) =>
      productClient.mostSoldProductByCategory(
        Object.assign({}, pageParam, queryKey[1]),
      ),
  );
}

export function useTopRatedProductsQuery(
  options: Partial<ProductQueryOptions>,
) {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.TOP_RATED_PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      productClient.topRated(Object.assign({}, pageParam, queryKey[1])),
  );
}
