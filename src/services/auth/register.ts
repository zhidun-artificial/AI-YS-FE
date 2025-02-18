import { httpPost } from '@/services/http';

interface RegisterRequest {
  username: string;
  password: string;
}

interface RegisterResponse {
  name: string;
  roleId: number;
  id: number;
}

export const registerUser = async (params: RegisterRequest) => {
  return httpPost<RegisterRequest, RegisterResponse>(
    '/api/v1/auth/register',
    params,
  );
};
