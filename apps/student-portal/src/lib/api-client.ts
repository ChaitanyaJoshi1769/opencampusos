import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { QueryClient } from '@tanstack/react-query';

// Apollo Client for GraphQL queries
export const apolloClient = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_SIS_SERVICE_URL}/graphql`,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

// React Query client for REST API calls
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

// Base API client for REST calls
export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SIS_SERVICE_URL}${path}`, {
      headers: {
        'X-Tenant-ID': process.env.NEXT_PUBLIC_TENANT_ID || '',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('API error');
    const json = await response.json();
    return json.data;
  },

  async post<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SIS_SERVICE_URL}${path}`, {
      method: 'POST',
      headers: {
        'X-Tenant-ID': process.env.NEXT_PUBLIC_TENANT_ID || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API error');
    const json = await response.json();
    return json.data;
  },

  async patch<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SIS_SERVICE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'X-Tenant-ID': process.env.NEXT_PUBLIC_TENANT_ID || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API error');
    const json = await response.json();
    return json.data;
  },
};
