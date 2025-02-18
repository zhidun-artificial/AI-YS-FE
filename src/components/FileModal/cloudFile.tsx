import { searchDocuments } from '@/services/documents/searchDocuments';
import { searchLibraries } from '@/services/libraries/searchLibraries';
import Icon from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import { Empty, Tree, Typography } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

import { ReactComponent as SvgDirComponent } from '@/assets/svg/dir.svg';
import { ReactComponent as SvgPdfComponent } from '@/assets/svg/pdf.svg';
import { ReactComponent as SvgWordComponent } from '@/assets/svg/word.svg';
import { DocFileInfo } from '@/services/chat/chatConversation';
// import { Attachments } from '@ant-design/x';
import AttachmentCard from '../ChatAttachments/AttachmentCard';

const { Title } = Typography;

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

interface CloudFileProps {
  onDocSelectChange: (docFiles: DocFileInfo[]) => void;
  style: React.CSSProperties;
}

const CloudFile: React.FC<CloudFileProps> = ({ style, onDocSelectChange }) => {
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
            key: item.id,
            checkable: false,
            style: { fontWeight: 'bold' },
            icon: <Icon component={SvgDirComponent} />,
            ...item,
          })),
        );
      }
    };
    updateRoot();
  }, []);

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    const docFiles: Array<DocFileInfo> = info.checkedNodes.map((node) => ({
      id: node.key as string,
      fileName: node.title as string,
      url: (node as unknown as { url: string }).url,
    }));
    setDocFiles(docFiles);
    setCheckedKeys(checkedKeys as React.Key[]);
    if (onDocSelectChange) onDocSelectChange(docFiles);
  };

  const loadTreeData: TreeProps['loadData'] = async (treeNode) => {
    console.log(treeNode);
    if (treeNode.children) {
      return;
    }
    const ret = await searchDocuments({
      libraryId: `${treeNode.key}`,
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
            icon: /\.pdf/.test(item.fileName) ? (
              <Icon component={SvgPdfComponent} />
            ) : (
              <Icon component={SvgWordComponent} />
            ),
          })),
        ),
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-row" style={style}>
      <div className="flex-1">
        <Title level={5}>专题库</Title>
        <div className="h-48 overflow-y-auto">
          <Tree
            treeData={treeData}
            showIcon={true}
            checkable={true}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            loadData={loadTreeData}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 h-48 gap-3 overflow-auto border-l border-[#DCE0E8] px-6">
        {docFiles.length > 0 ? (
          docFiles.map((item) => (
            <AttachmentCard
              styles={{
                container: { minWidth: 200 },
              }}
              key={item.id}
              info={{
                id: `${item.id}`,
                fileName: item.fileName,
                url: item.url,
              }}
            ></AttachmentCard>
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

export default CloudFile;
