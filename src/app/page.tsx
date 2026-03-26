"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* 로고 영역 */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-3xl flex items-center justify-center">
          <span className="text-5xl">&#9997;&#65039;</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">블로그 글 도우미</h1>
        <p className="text-lg text-[var(--color-text-light)] leading-relaxed">
          우리 가게를 알리는
          <br />
          블로그 글을 쉽고 빠르게
          <br />
          만들어 드려요
        </p>
      </div>

      {/* 특징 설명 */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-3xl flex-shrink-0">&#128172;</span>
          <span className="text-lg text-left">가게 정보만 알려주세요</span>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-3xl flex-shrink-0">&#129302;</span>
          <span className="text-lg text-left">알아서 글을 써드려요</span>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-3xl flex-shrink-0">&#128203;</span>
          <span className="text-lg text-left">복사해서 블로그에 올리면 끝!</span>
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={() => router.push("/steps/step1")}
        className="
          w-full max-w-sm h-16 rounded-2xl text-xl font-bold
          bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
          text-white shadow-lg
          transition-all duration-200 active:scale-[0.98]
        "
      >
        블로그 글 쓰러 가기
      </button>
    </div>
  );
}
