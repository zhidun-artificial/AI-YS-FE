import { httpPost } from '@/services/http';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  info: {
    name: string;
    roleId: number;
    id: number;
  };
  token: string;
}

export const login = async (params: LoginRequest) => {
  return httpPost<LoginRequest, LoginResponse>('/api/v1/auth/login', params);
};
