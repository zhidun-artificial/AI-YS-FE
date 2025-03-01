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

export const loginByCAS = async (params: LoginRequest) => {
  return httpPost<LoginRequest, LoginResponse>(`/v1/tickets`, params, {
    API_URL: `${document.location.origin}/cas/rest`
  });
};

export const loginByCASRest = async (params: LoginRequest) => {

  const { username, password } = params;
  const tgtResponse = await fetch(`${location.origin}/cas/v1/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  });

  if (!tgtResponse.ok) {
    throw new Error('登录失败');
  }
  const tgtUrl = await tgtResponse.text();
  const tgt = tgtUrl.split('/').pop(); // 提取 TGT

  const stResponse = await fetch(`${location.origin}/cas/v1/tickets/${tgt}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ service: location.origin }),
  });

  if (!stResponse.ok) {
    throw new Error('获取 Service Ticket 失败');
  }
  const serviceTicket = await stResponse.text();
  return serviceTicket; // 前端可携带 ST 访问受保护资源
}
