import { API_URL, STORE_KEY_TOKEN } from '@/constants';
import { history, request, RequestOptions } from '@umijs/max';
import { message } from 'antd';
import { ExpireError } from './error';

// 请求返回值类型
export type ApiResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

export interface RequestCustomOptions extends RequestOptions {
  API_URL?: string;
  ignoreError?: boolean;
}

export const isResponseOK = (status: number) => status >= 200 && status < 300;

export async function httpGet<T = Record<string, unknown>, R = object>(
  url: string,
  params: T,
  options: RequestCustomOptions = {},
): Promise<ApiResponse<R> | Error> {
  return request<ApiResponse<T>>(`${options.API_URL || API_URL}${url}`, {
    method: 'GET',
    params,
    getResponse: true,
    ...options
  }).then(
    (res) => res.data,
    (err) => err,
  );
}

export async function httpPost<T = Record<string, unknown>, R = object>(
  url: string,
  data: T,
  options: RequestCustomOptions = {},
): Promise<ApiResponse<R> | Error> {
  return request<ApiResponse<T>>(`${options.API_URL || API_URL}${url}`, {
    method: 'POST',
    data,
    getResponse: true,
    ...options
  }).then(
    (res) => res.data,
    (err) => err,
  );
}

export async function httpPatch<T = Record<string, unknown>, R = object>(
  url: string,
  data: T,
  options: RequestCustomOptions = {},
): Promise<ApiResponse<R> | Error> {
  return request<ApiResponse<T>>(`${options.API_URL || API_URL}${url}`, {
    method: 'PATCH',
    data,
    getResponse: true,
    ...options
  }).then(
    (res) => res.data,
    (err) => err,
  );
}

export async function httpDelete<T = Record<string, unknown>, R = object>(
  url: string,
  params: T,
  options: RequestCustomOptions = {},
): Promise<ApiResponse<R> | Error> {
  return request<ApiResponse<T>>(`${options.API_URL || API_URL}${url}`, {
    method: 'DELETE',
    params,
    getResponse: true,
    ...options
  }).then(
    (res) => res.data,
    (err) => err,
  );
}

export async function httpPut<T = Record<string, unknown>, R = object>(
  url: string,
  data: T,
  options: RequestCustomOptions = {},
): Promise<ApiResponse<R> | Error> {
  return request<ApiResponse<T>>(`${options.API_URL || API_URL}${url}`, {
    method: 'PUT',
    data,
    getResponse: true,
    ...options
  }).then(
    (res) => res.data,
    (err) => err,
  );
}

export async function httpHead<T = Record<string, unknown>, R = null>(
  url: string,
  params: T,
  options: RequestCustomOptions = {},
): Promise<ApiResponse<R> | Error> {
  return request<ApiResponse<T>>(`${options.API_URL || API_URL}${url}`, {
    method: 'HEAD',
    params,
    getResponse: true,
    ...options
  }).then(
    (res) => res.data,
    (err) => err,
  );
}

export async function httpStream<T = Record<string, unknown>>(
  url: string,
  data: T,
): Promise<ReadableStream<Uint8Array<ArrayBufferLike>> | Error> {
  const token = localStorage.getItem(STORE_KEY_TOKEN);

  const response = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      auth: token || '',
    },
  });

  if (response.status === 403) {
    message.error('用户登录过期，请先登录');
    history.push('/login');
    return new ExpireError('expire');
  }

  if (!isResponseOK(response.status)) {
    return new Error(response.statusText);
  }

  if (response.headers.has('auth')) {
    localStorage.setItem(STORE_KEY_TOKEN, response.headers.get('auth') as string);
  }

  if (!response.body) {
    return new Error('Response body is empty');
  }

  return response.body;
}
