import {
  addDocuments
} from '@/services/knowledge/management';
import { TmpFileInfo } from '@/services/tmpfile/uploadTmpFile';
import FileUpload, { FileUploadProps } from "@/components/ChatAttachments/FileUpload";
import { useCallback } from "react";
import { ModalForm } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
export default (props: {
  reload: (() => Promise<void>) | undefined;
  baseId: string;
}) => {
  // const [form] = Form.useForm<{ name: string }>();
  const uploadFn: FileUploadProps['uploadFn'] = useCallback(async (file) => {
    const params = {
      files: [file],
      baseId: props.baseId,
    }
    const res = await addDocuments(params);
    if (res instanceof Error) {

      return new Error('上传失败')
    } else {
      // new Error(res.message)
      return res.data as TmpFileInfo;
    }
  }, [])
  return (
    <ModalForm<{
      name: string;
    }>
      title="上传文件"
      trigger={
        <Button className='' type='primary' icon={<PlusOutlined />}>新建上传</Button>}
      // form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      width={540}
      submitTimeout={2000}
      onFinish={async () => {

        message.success('上传成功');
        if (props.reload) props.reload();
        return true;
      }}
    >
      <FileUpload uploadFn={uploadFn} onFileChange={(files) => { console.log(files) }} />
    </ModalForm>
  );
};
