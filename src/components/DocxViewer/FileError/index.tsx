import { Alert, Flex } from 'antd';
import React from 'react';
import styles from './index.less';

const FileError = ({ children }: React.PropsWithChildren) => {
  return (
    <Flex align="center" justify="center" className={styles.errorWrapper}>
      <Alert
        type="error"
        message={<h2>{children || '文件管理'}</h2>}
      ></Alert>
    </Flex>
  );
};

export default FileError;
