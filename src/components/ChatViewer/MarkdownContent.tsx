import { Typography } from "antd";
import React, { PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
// import rehypeReact from "rehype-react";

const isEmptyChildren = (children: any) => {
  if (children === null) return true;
  if (typeof children === 'string' && children.trim() === '') return true;
  return React.Children.count(children) === 0;
}

interface MarkdownContentProps {
  content: string;
}

const ThinkComponent: React.FC<PropsWithChildren> = ({ children }) => {
  if (isEmptyChildren(children)) return null;
  return (
    <Typography style={{ color: '#4b5563' }} className="bg-slate-200 italic text-xs py-2 mb-2 rounded-sm">
      <h6 className="mb-2">思考: </h6>
      {children}
    </Typography>
  );
};


const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <Typography>
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          // [rehypeReact, {
          //   createElement: React.createElement,
          //   Fragment: React.Fragment,
          //   components: {
          //     think: ThinkComponent
          //   }
          // }]
        ]}
        components={{
          think: ThinkComponent
        } as any}
      >
        {content}
      </ReactMarkdown>
    </Typography>
  );
}



export default React.memo(MarkdownContent);