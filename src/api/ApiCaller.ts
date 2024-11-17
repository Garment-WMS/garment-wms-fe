/* eslint-disable @typescript-eslint/no-explicit-any */

const defaultURL = import.meta.env.VITE_LOCALHOST_URL as string;
const serverURL = 'http://localhost:8000';

export interface ApiCallerParams {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
}

const ApiCaller = (
  method: string,
  endpoint: string,
  headers?: Record<string, string>,
  params?: Record<string, any>,
  body?: any
) => {
  const config: ApiCallerParams = {
    method,
    url: defaultURL + endpoint,
    headers: { ...headers },
    params: { ...params },
    data: body
  };
  return config;
};

export const get = (
  endpoint: string,
  params?: Record<string, any>,
  headers?: Record<string, string>,
): ApiCallerParams => {
  return ApiCaller('GET', endpoint, headers, params);
};

export const post = (
  endpoint: string,
  body?: any,
  params?: Record<string, any>,
  headers?: Record<string, string>
): ApiCallerParams => {
  return ApiCaller('POST', endpoint, headers, params, body);
};

export const put = (
  endpoint: string,
  body?: any,
  params?: Record<string, any>,
  headers?: Record<string, string>
): ApiCallerParams => {
  return ApiCaller('PUT', endpoint, headers, params, body);
};

export const remove = (
  endpoint: string,
  body?: any,
  params?: Record<string, any>,
  headers?: Record<string, string>
): ApiCallerParams => {
  return ApiCaller('DELETE', endpoint, headers, params, body);
};
