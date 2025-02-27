import FileUpload, { FileUploadProps } from "@/components/ChatAttachments/FileUpload";
import React, { useCallback } from "react";

const sleep = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const Demo: React.FC = () => {

  const uploadFn: FileUploadProps['uploadFn'] = useCallback(async (file) => {
    const ret = Math.floor(Math.random() * 100) % 3;
    await sleep(3000);
    if (ret === 0) return { id: `${ret}`, fileName: file.name, url: 'http://www.baidu.com' }
    if (ret === 1) return new Error('上传失败')
    return new Error('接口错误')
  }, [])

  return (
    <>
      <h1>Demo</h1>
      <FileUpload uploadFn={uploadFn} onFileChange={(files) => { console.log(files) }}>
      </FileUpload>
    </>
  )
}

export default Demo;