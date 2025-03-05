import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProduct } from '../../../types/product';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery,
  tagTypes: ['Favorites', 'Products',],
  endpoints: (builder) => ({
    fetchProducts: builder.query<IProduct[], Record<string, any>>({
      query: (params) => ({
        url: '/api/items',
        params,
      }),
      providesTags: ['Products'],
    }),
    getProductById: builder.query<IProduct, string>({
      query: (id) => `/api/items/${id}`,
      providesTags: ['Products'],
    }),
    toggleFavorite: builder.mutation<void, string>({
        query: (itemId) => ({
          url: '/api/users/toggle-favorite',
          method: 'POST',
          body: { itemId },
        }),
        invalidatesTags: ['Favorites'],
    }),
    fetchCreateProduct: builder.mutation<void, any>({
      query: (fields) => ({
        url: '/api/items',
        method: 'POST',
        body: fields,
      }),
      invalidatesTags: ['Products'],
    }),
    fetchUpdateProduct: builder.mutation<void, any>({
      query: ({ id, ...fields}) => ({
        url: `/api/items/${id}`,
        method: 'PUT',
        body: fields,
      }),
      invalidatesTags: ['Products'],
    }),
    fetchDeleteProduct: builder.mutation<void, any>({
      query: (id) => ({
        url: `/api/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

  }),
});


export const {
  useFetchProductsQuery,
  useGetProductByIdQuery,
  useToggleFavoriteMutation,
  useFetchCreateProductMutation,
  useFetchUpdateProductMutation,
  useFetchDeleteProductMutation,
} = apiSlice;