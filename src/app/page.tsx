"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-3 bg-blue-50 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">&#9997;&#65039;</span>
        </div>
        <h1 className="text-2xl font-bold mb-1.5 tracking-tight">블로그 글 도우미</h1>
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
          매장 정보를 입력하면<br />
          AI가 블로그 글을 작성해 드려요
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2.5 mb-8">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-3.5">
          <span className="text-xl flex-shrink-0">&#128172;</span>
          <span className="text-sm text-left">매장 이름과 주소만 알려주세요</span>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-3.5">
          <span className="text-xl flex-shrink-0">&#128269;</span>
          <span className="text-sm text-left">실제 매장 정보를 검색해서 글을 써요</span>
        </div>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl p-3.5">
          <span className="text-xl flex-shrink-0">&#128203;</span>
          <span className="text-sm text-left">복사해서 블로그에 올리면 끝!</span>
        </div>
      </div>

      <button
        onClick={() => router.push("/steps/step1")}
        className="
          w-full max-w-sm h-12 rounded-xl text-base font-semibold
          bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
          text-white
          transition-all duration-200 active:scale-[0.98]
        "
      >
        시작하기
      </button>
    </div>
  );
}
