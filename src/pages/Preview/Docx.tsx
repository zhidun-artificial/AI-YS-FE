// import { useLocation } from "@umijs/max";
import React from "react";
import { useLocation } from "umi";
import { parse } from "query-string";
import DocxViewer from "@/components/DocxViewer";
import { Alert, Button } from "antd";


const DocxPreview: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search);
  const fileUrl = decodeURIComponent(query.file as string || '');
  const fileName = decodeURIComponent(query.name as string || '');
  return (
    <div className="w-full h-full flex flex-col justify-center items-center pt-[64px]">
      <div className="fixed top-0 left-0 w-full h-[64px] flex items-center justify-center bg-white shadow-sm z-50">
        <span>文件预览：{fileName}</span>
        <Button type="link"><a href={fileUrl} download>下载</a></Button>
      </div>
      {fileUrl ? <DocxViewer filePath={fileUrl}></DocxViewer>
        :
        <>
          <Alert message={'预览文件不存在'} type="error"></Alert>
        </>
      }
    </div>
  );
}

export default DocxPreview;