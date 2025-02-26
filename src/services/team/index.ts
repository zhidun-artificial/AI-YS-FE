import { httpDelete, httpPost } from '../http';

export interface ITeam {
  name: string;
  description: string;
  adminId: number;
  ext: { [key: string]: any };
}

export interface TeamResponse {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const addTeam = async (params: ITeam) => {
  return httpPost<ITeam, TeamResponse>('/api/v1/user_groups', params);
};

export const updateTeam = async (params: ITeam & { id: number }) => {
  return httpPost<ITeam & { id: number }, TeamResponse>(
    `/api/v1/user_groups/${params.id}`,
    params,
  );
};

export const getTeams = async (params: {
  key?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}) => {
  return httpPost('/api/v1/user_groups/search', params);
};

export const deleteTeam = async (params: { id: number }) => {
  return httpDelete(`/api/v1/user_groups/${params.id}`, params);
};

export const addUser = async (params: { userId: number; groupId: number }) => {
  return httpPost('/api/v1/user_groups/add_user', params);
};

export const deleteUser = async (params: {
  userId: number;
  groupId: number;
}) => {
  return httpPost('/api/v1/user_groups/delete_user', params);
};
