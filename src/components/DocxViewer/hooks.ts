import { request } from '@umijs/max';
import mammoth from 'mammoth';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCatchError = (api: string) => {
  const [error, setError] = useState('');
  const fetchDocument = useCallback(async () => {
    const ret = await request(api, { method: 'GET', responseType: 'arraybuffer', getResponse: true, ignoreError: true });
    const { data } = ret;
    if (!(data instanceof ArrayBuffer) && data.code !== 0) {
      setError(data.message);
    }
    return ret;
  }, [api]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  return { fetchDocument, error };
};

export const useFetchDocument = () => {
  const fetchDocument = useCallback(async (api: string) => {
    const ret = await request(api, { method: 'GET', responseType: 'arraybuffer', getResponse: true, ignoreError: true });
    return ret;
  }, []);

  return { fetchDocument };
};


export const useFetchDocx = (filePath: string) => {
  const [succeed, setSucceed] = useState(true);
  const [error, setError] = useState<string>();
  const { fetchDocument } = useFetchDocument();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchDocumentAsync = useCallback(async () => {
    try {
      const jsonFile = await fetchDocument(filePath);
      mammoth
        .convertToHtml(
          { arrayBuffer: jsonFile.data },
          { includeDefaultStyleMap: true },
        )
        .then((result) => {
          setSucceed(true);
          const docEl = document.createElement('div');
          docEl.className = 'document-container';
          docEl.innerHTML = result.value;
          const container = containerRef.current;
          if (container) {
            container.innerHTML = docEl.outerHTML;
          }
        })
        .catch(() => {
          setError('文件格式解析失败')
          setSucceed(false);
        });
    } catch (error: any) {
      setError(error.toString());
    }
  }, [filePath, fetchDocument]);

  useEffect(() => {
    fetchDocumentAsync();
  }, [fetchDocumentAsync]);

  return { succeed, containerRef, error };
};
