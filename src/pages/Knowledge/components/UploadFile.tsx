import FileUpload, { FileUploadProps } from "@/components/ChatAttachments/FileUpload";
import { useCallback, useState } from "react";
import { ModalForm } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import { uploadDocFile } from '@/services/knowledge/uploadDoc';
import { TmpFileInfo } from "@/services/tmpfile/uploadTmpFile";


export default (props: {
  reload: (() => Promise<void>) | undefined;
  baseId: string;
}) => {
  const [uploadDocFiles, setUploadDocFiles] = useState<TmpFileInfo[]>([])

  const uploadFn: FileUploadProps['uploadFn'] = useCallback(async (file) => {
    const params = {
      files: [file],
      baseId: props.baseId,
    }
    const res = await uploadDocFile(params);
    if (res instanceof Error) {
      return res;
    }
    if (res.code !== 0) return new Error(res.msg);

    if (res.data.unknowns.length > 0) return new Error('文件类型不支持');

    const resFile = res.data.saved[0];

    if (resFile.blockedReason) return new Error(resFile.blockedReason);

    return {
      id: resFile.id,
      fileName: resFile.fileName,
      url: resFile.url,
    }
  }, [])
  return (
    <ModalForm<{
      name: string;
    }>
      title={`上传文件(${uploadDocFiles.length})`}
      trigger={
        <Button className='' type='primary' icon={<PlusOutlined />}>新建上传</Button>}
      // form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      width={940}
      submitTimeout={2000}
      onFinish={async () => {

        message.success('上传成功');
        if (props.reload) props.reload();
        return true;
      }}
    >
      <FileUpload uploadFn={uploadFn} canCardRemove={false} onFileChange={(changeType, files) => {
        if (changeType === 'add') {
          setUploadDocFiles([...uploadDocFiles, ...files])
        } else {
          setUploadDocFiles(uploadDocFiles.filter((file) => !files.some((f) => f.id === file.id)));
        }
      }} />
    </ModalForm>
  );
};
