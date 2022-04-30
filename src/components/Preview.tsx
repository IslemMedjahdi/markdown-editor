import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PropsTypes = {
  text: string;
};

export default function Preview({ text }: PropsTypes) {
  return (
    <div className="bg-zinc-900">
      <div className="top-[8vh] flex h-[5vh] cursor-pointer items-center bg-neutral-700 px-4 duration-150 hover:bg-neutral-600 md:sticky">
        <p className="font-RMono text-sm tracking-widest text-gray-300">
          PREVIEW
        </p>
      </div>
      <div className="dark">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="prose prose-invert h-[87vh] max-w-none resize-none !overflow-auto bg-transparent p-2 font-RSerif scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-neutral-800 prose-pre:m-4 prose-pre:overflow-auto prose-pre:bg-zinc-800 prose-pre:scrollbar-track-gray-100"
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
