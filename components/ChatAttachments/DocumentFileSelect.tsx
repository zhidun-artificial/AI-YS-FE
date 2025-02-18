import { DocFileInfo } from '@/services/chat/chatConversation';
import { DocItem, searchDocuments } from '@/services/documents/searchDocuments';
import { searchLibraries } from '@/services/libraries/searchLibraries';
import type { TreeDataNode, TreeProps } from 'antd';
import { Empty, Tree, Typography } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
import AttachmentCard from './AttachmentCard';
import { IconDir, IconPdfFile, IconWordFile } from './FileIcon';

const { Title } = Typography;

const getFileIcon = (fileName: string) => {
  return /\.pdf/.test(fileName) ? <IconPdfFile /> : <IconWordFile />;
};

const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[],
): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

interface DocumentFileSelectProps {
  onDocSelectChange?: (docFiles: DocFileInfo[]) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const DocumentFileSelect: React.FC<DocumentFileSelectProps> = ({
  style,
  onDocSelectChange,
  disabled,
}) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [docFiles, setDocFiles] = useState<DocFileInfo[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const updateRoot = async () => {
      const ret = await searchLibraries({ key: '', pageNo: 1, pageSize: 999 });
      if (ret instanceof Error) {
        console.error(ret.message);
        return;
      }
      if (ret.code === 0) {
        setTreeData(
          ret.data.records.map((item) => ({
            title: item.name,
            key: `lib-${item.id}`,
            checkable: false,
            style: { fontWeight: 'bold' },
            isLeaf: item.docCount === 0,
            icon: <IconDir />,
            ...item,
          })),
        );
      }
    };
    updateRoot();
  }, []);

  const onTitleClick = (node: DocItem) => {
    setCheckedKeys((prevCheckedKeys) => {
      const newCheckedKeys = prevCheckedKeys.includes(node.id)
        ? prevCheckedKeys.filter((key) => key !== node.id)
        : [...prevCheckedKeys, node.id];
      return newCheckedKeys;
    });
    setDocFiles((prevDocFiles) => {
      const newDocFiles = prevDocFiles.map((f) => f.id).includes(`${node.id}`)
        ? prevDocFiles.filter((file) => `${file.id}` !== `${node.id}`)
        : [
            ...prevDocFiles,
            { id: `${node.id}`, fileName: node.fileName, url: node.url },
          ];
      return newDocFiles;
    });
  };

  useEffect(() => {
    if (onDocSelectChange) onDocSelectChange(docFiles);
  }, [docFiles]);

  const renderTreeFileNode = (item: DocItem, disabled: boolean = false) => (
    <div
      className="flex items-center"
      onClick={disabled ? undefined : () => onTitleClick(item)}
    >
      {getFileIcon(item.fileName)}
      <span
        className="ml-2 max-w-[300px] line-clamp-1 whitespace-pre"
        title={item.fileName}
      >
        {item.fileName}
      </span>
    </div>
  );

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    const docFiles: Array<DocFileInfo> = info.checkedNodes.map((node) => ({
      id: node.key as string,
      fileName: (node as unknown as { fileName: string }).fileName,
      url: (node as unknown as { url: string }).url,
    }));
    setDocFiles(docFiles);
    setCheckedKeys(checkedKeys as React.Key[]);
    if (onDocSelectChange) onDocSelectChange(docFiles);
  };

  const onDeleteFile = (file: DocFileInfo) => {
    const newFiles = docFiles.filter((item) => `${item.id}` !== file.id);
    setCheckedKeys(checkedKeys.filter((key) => `${key}` !== file.id));
    setDocFiles(newFiles);
    if (onDocSelectChange) onDocSelectChange(newFiles);
  };

  const loadTreeData: TreeProps['loadData'] = async (treeNode) => {
    console.log(treeNode);
    if (treeNode.children) {
      return;
    }
    const ret = await searchDocuments({
      libraryId: `${(treeNode as unknown as { id: string }).id}`,
      pageNo: 1,
      pageSize: 999,
    });
    if (ret instanceof Error) {
      console.error(ret.message);
      return;
    }
    if (ret.code === 0) {
      setTreeData((origin) =>
        updateTreeData(
          origin,
          treeNode.key,
          ret.data.records.map((item) => ({
            ...item,
            key: item.id,
            isLeaf: true,
            title: () => renderTreeFileNode(item, disabled),
          })),
        ),
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-row" style={style}>
      <div className="flex-1 flex flex-col">
        <Title level={5} className="flex-0">
          专题库
        </Title>
        <div className="flex-1 overflow-y-auto relative">
          {disabled && (
            <div
              className="absolute inset-0 bg-white bg-opacity-0 z-10 cursor-not-allowed"
              onClick={(e) => e.stopPropagation()}
            ></div>
          )}
          <Tree
            disabled={disabled}
            treeData={treeData}
            showIcon={true}
            checkable={true}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            loadData={loadTreeData}
          />
        </div>
      </div>
      <div
        className={`flex flex-col flex-1 h-full gap-3 overflow-auto border-l border-[#DCE0E8] px-6 ${
          docFiles.length > 0 ? '' : 'justify-center'
        }`}
      >
        {docFiles.length > 0 ? (
          docFiles.map((item) => (
            <AttachmentCard
              styles={{ container: { width: '100%' } }}
              key={item.id}
              info={{
                id: `${item.id}`,
                fileName: item.fileName,
                description: '',
                url: item.url,
              }}
              onClose={onDeleteFile}
            />
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无上传文档"
          ></Empty>
        )}
      </div>
    </div>
  );
};

export default DocumentFileSelect;
