import { httpGet } from '@/services/http';

interface TokenRequest {
  ticket: string;
  service: string;
}

interface TokenResponse {
  token: string;
  detail: {
    userName: string;
    userId: number;
    permit: number;
    st: string;
    password: string;
    username: string;
    authorities: [
      {
        authority: string;
      }
    ],
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
  }
}

export const getToken = async (params: TokenRequest) => {
  return httpGet<TokenRequest, TokenResponse>('/api/auth/token', params);
};
