import { Segmented } from 'antd';
import './index.css';

export default function Search() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <section className="tips-card p-8 flex flex-col items-center mt-20 w-[672px] mx-auto rounded-[20px]">
        <span className="tips-title mb-4">智能文献搜索</span>
        <p className="w-[512px] text-center text-[#4B5563] text-base font-normal">
          通过先进的语义分析技术，精准理解您的搜索意图，快速定位知识库中的相关文献，让您的办公和学习更加高效自由。
          <span className="text-[#4F46E5]">✨ 让知识触手可及</span>
        </p>
      </section>
      <div className="mt-8 mx-auto">
        <Segmented<string>
          options={['语意检索', '关键词检索']}
          size="large"
          onChange={(value) => {
            console.log(value); // string
          }}
        />
      </div>
    </div>
  );
}
