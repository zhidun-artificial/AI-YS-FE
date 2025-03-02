export const APP_NAME = 'AI知识服务系统';
export const CAS_URL = `http://113.108.105.54:56800/cas/login?service=${document.location.origin}${document.location.pathname}`;
export const CAS_URL_EXIT = `http://113.108.105.54:56800/cas/logout`;
export const API_URL =
  process.env.NODE_ENV === 'development'
    ? `http://113.108.105.54:56800/aihub`
    : `${document.location.origin}/${process.env.BASE_URL}`;
export const API_ID = 'app-AfXTmtLqq5OKdPcoGYLF6M13';

export const STORE_KEY_TOKEN = 'token';

export const STORE_KEY_USER_ID = 'user_id';
export const STORE_KEY_USER_NAME = 'user_name';
export const STORE_KEY_USER_ROLE = 'user_role';

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 200; // 200MB
export const MAX_ATTACHMENT_COUNT = 10;
