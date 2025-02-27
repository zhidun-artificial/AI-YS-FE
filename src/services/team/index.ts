import { httpDelete, httpPost } from '../http';

export interface ITeam {
  name: string;
  description: string;
  adminId: number;
  ext: { [key: string]: any };
}

export interface ISearchParams {
  key?: string;
  pageNo?: number;
  pageSize?: number;
  withUsers: boolean;
  sort?: string;
}

export interface TeamResponse {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface IGroupItem {
  id: number;
  name: string;
  creatorName: string;
  description: string;
  ext: { [key: string]: any };
  createTime: number;
  updateTime: number;
  userCount: number;
  users: any[];
}

export interface SearchGroupResponse {
  total: number;
  records: IGroupItem[];
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

export const getTeams = async (params: ISearchParams) => {
  return httpPost<ISearchParams, SearchGroupResponse>(
    '/api/v1/user_groups/search',
    params,
  );
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
