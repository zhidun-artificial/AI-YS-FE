import { httpDelete, httpPost, httpPut } from '@/services/http';

interface UserRequest {
  key: string;
  pageNo: number;
  pageSize: number;
}

export type UserItem = {
  id: number;
  roleId: number;
  name: string;
  remarks: string;
  createTime: string;
};

interface UserResponse {
  records: UserItem[];
  total: number;
}

export const getUsers = async (params: UserRequest) => {
  return httpPost<UserRequest, UserResponse>('/api/v1/users/search', params);
};

export const deleteUser = async (id: number) => {
  return httpDelete(`/api/v1/users/${id}`, {});
};

export const updateRole = async (params: {
  id: number | undefined;
  role: number | undefined;
}) => {
  return httpPut('/api/v1/users/update_role', params);
};
