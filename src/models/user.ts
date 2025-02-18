// 全局共享数据示例
import { STORE_KEY_USER_ID, STORE_KEY_USER_NAME, STORE_KEY_USER_ROLE } from '@/constants';
import { useState } from 'react';

interface UserInfo {
  id: number;
  name: string;
  roleId: number;
  userAvatar?: string;
}

const useUser = () => {
  const [user, setUser] = useState<UserInfo>({
    id: Number(localStorage.getItem(STORE_KEY_USER_ID) || 0),
    name: localStorage.getItem(STORE_KEY_USER_NAME) || '',
    userAvatar: '',
    roleId: Number(localStorage.getItem(STORE_KEY_USER_ROLE) || 0),
  });
  return {
    user,
    setUser,
  };
};

export default useUser;
