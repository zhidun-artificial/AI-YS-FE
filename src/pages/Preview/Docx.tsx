// import { useLocation } from "@umijs/max";
import React from "react";
import { useLocation } from "umi";
import { parse } from "query-string";
import DocxViewer from "@/components/DocxViewer";
import { Alert } from "antd";


const DocxPreview: React.FC = () => {
  const location = useLocation();
  const query = parse(location.search);
  const fileUrl = decodeURIComponent(query.file as string || '');
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
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