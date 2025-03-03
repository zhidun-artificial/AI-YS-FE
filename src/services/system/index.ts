import { httpGet, httpPost } from '../http';

export interface ISystem {
  systemName: string;
  logo: string;
  defaultPrompt: string;
}

export const getSystemConfig = async () => {
  return httpGet<Record<string, never>, { data: ISystem }>(
    '/api/v1/sys_config/base',
    {},
  );
};

export const setSystemConfig = async (params: ISystem) => {
  return httpPost<ISystem, { data: any }>('/api/v1/sys_config/base', params);
};
