import { httpPost } from '@/services/http';

interface TranslateToZhRequest {
  texts: string[];
}

type TranslateToZhResponse = Array<{
  index: number;
  source: string;
  target: string;
}>;

export const translateToZh = (params: string) => {
  return httpPost<TranslateToZhRequest, TranslateToZhResponse>(
    '/api/v1/translate',
    { texts: [params] },
  );
};
