import EmptyFile from '@/assets/images/empty-file.png';
import PdfPng from '@/assets/images/pdf.png';
import WordPng from '@/assets/images/word.png';
import { API_ID, API_URL } from '@/constants';
import type { UploadProps } from 'antd';
import { Empty, List, message, Typography, Upload } from 'antd';
import React from 'react';
import FileCard from '../FileCard';
import type { FileType } from './type';

const { Dragger } = Upload;
const token: string = localStorage.getItem('token') || API_ID;

const LocalFile: React.FC<{
  files: FileType[];
  actionPath?: string;
  libraryId?: string;
  setFiles: (files: FileType[]) => void;
}> = (props) => {
  const fileProps: UploadProps = {
    name: 'files',
    accept: 'application/pdf, .doc, .docx',
    multiple: true,
    headers: {
      Auth: `${token}`,
    },
    action: props.libraryId
      ? `${API_URL}${props.actionPath}?libraryId=${props?.libraryId}`
      : `${API_URL}${props.actionPath}`,
    showUploadList: false,
    beforeUpload(file, fileList) {
      const files = fileList.map((item) => {
        return {
          name: item.name,
          status: 'uploading' as 'uploading',
        };
      });
      props.setFiles([...props.files, ...files]);
    },
    onChange(info) {
      // console.log(info.file, info.fileList);
      const { status, response } = info.file;
      if (status === 'done') {
        if (response.code === 0) {
          if (response.data.saved[0].blockedReason) {
            const files = props.files.filter(
              (item) => item.name !== info.file.name,
            );
            props.setFiles(files);
            message.error(
              `${info.file.name} 文件上传失败，${response.data.saved[0].blockedReason}`,
            );
          } else {
            const files = props.files.map((item) => {
              if (item.name === info.file.name) {
                return {
                  name: item.name,
                  status: 'success' as 'success',
                };
              }
              return item;
            });
            props.setFiles(files);
          }
        }
      } else if (status === 'error') {
        const files = props.files.filter(
          (item) => item.name !== info.file.name,
        );
        props.setFiles(files);
        message.error(`${info.file.name} 文件上传失败.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <div className="mt-6">
      {props.files.length > 0 ? (
        <List
          className="h-[290px] overflow-auto"
          grid={{ gutter: 16, column: 3 }}
          dataSource={props.files}
          renderItem={(item) => (
            <List.Item>
              <FileCard
                imgSrc={item.name.includes('.pdf') ? PdfPng : WordPng}
                name={item.name}
                status={item.status}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={EmptyFile}
          className="flex flex-col items-center h-[290px] justify-center"
          description={
            <Typography.Text
              type="secondary"
              className="text-sm text-[#A1ABC2]"
            >
              暂无上传文档
            </Typography.Text>
          }
        ></Empty>
      )}
      <Dragger
        {...fileProps}
        className="h-[180px] inline-block w-full bg-[#F4F5FE]"
      >
        <p className="ant-upload-text !mb-4">点击上传或拖入文档</p>
        <p className="ant-upload-hint">
          最多可上传10个文件，文档大小不超过200MB，支持：doc、docx、ppt、pptx、pdf、xls、xlsx
        </p>
      </Dragger>
    </div>
  );
};

export default LocalFile;
