import React, { useRef } from "react";

type PropsTypes = {
  text: string;
  changeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function MarkDown({ text, changeHandler }: PropsTypes) {
  const focus = useRef<any>();

  return (
    <div className="bg-zinc-900">
      <div
        onClick={() => focus.current && focus.current.focus()}
        className="top-[8vh] flex h-[5vh] cursor-pointer items-center bg-neutral-700 px-4 duration-150 hover:bg-neutral-600 md:sticky"
      >
        <p className="font-RMono text-sm tracking-widest text-gray-300">
          MARKDOWN
        </p>
      </div>
      <div className="w-full overflow-hidden">
        <textarea
          ref={focus}
          value={text}
          onChange={changeHandler}
          className="block h-[87vh] w-full max-w-full resize-none border-0 bg-transparent p-2 font-RMono text-sm text-gray-300 outline-0 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-neutral-800 "
        />
      </div>
    </div>
  );
}
