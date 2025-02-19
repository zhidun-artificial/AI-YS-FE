import { httpDelete, httpGet, httpPost, httpPut } from '@/services/http';

interface RoleRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

export type RoleItem = {
  id: number;
  name: string;
  remarks: string;
  createTime: string;
};

interface RoleResponse {
  records: RoleItem[];
  total: number;
}

interface Role {
  id: number;
  path: string;
  parentId: number;
  name: string;
  title: string;
  has: boolean;
}

export interface RoleDetail {
  data: Role[];
}

export interface AuthItem {
  id: number;
  parentId?: string | number | null;
  title: string;
  name: string;
  has: true;
}

export const getRoles = async (params: RoleRequest) => {
  return httpPost<RoleRequest, RoleResponse>('/api/v1/roles/search', params);
};

export interface updateRoleRequest {
  id: string | number;
  name: string;
  remarks: string;
}

export const updateRole = async (params: updateRoleRequest) => {
  return httpPut(`/api/v1/roles/${params.id}`, params);
};

// 删除角色
export const deleteRole = async (id: number) => {
  return httpDelete(`/api/v1/roles/${id}`, {});
};

export const setPermissions = async (params: {
  id: number;
  data: AuthItem[];
}) => {
  return httpPut(`/api/v1/roles/${params.id}/permissions`, {
    data: params.data,
  });
};

export const getPermissions = async (id: number) => {
  return httpGet<object, RoleDetail>(`/api/v1/roles/${id}/permissions`, {});
};
