"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";

function Step2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeName = searchParams.get("storeName") || "";
  const storeAddress = searchParams.get("storeAddress") || "";
  const theme = searchParams.get("theme") || "";
  const keywords = searchParams.get("keywords") || "";

  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"search" | "generate">("search");
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const generatePost = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError("");
    setPhase("search");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, storeAddress, theme, keywords }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "글 생성에 실패했어요");
      }

      const data = await res.json();
      setTitle(data.title);
      setHtml(data.html);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "문제가 발생했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [storeName, storeAddress, theme, keywords]);

  useEffect(() => {
    generatePost();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [generatePost]);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setPhase("generate"), 15000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleProceed = () => {
    sessionStorage.setItem("blogTitle", title);
    sessionStorage.setItem("blogHtml", html);
    router.push("/steps/step3");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
        <div className="w-14 h-14 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
          <span className="text-2xl animate-bounce">
            {phase === "search" ? "🔍" : "✍️"}
          </span>
        </div>
        <h2 className="text-lg font-bold mb-2">
          {phase === "search"
            ? `'${storeName}' 매장 정보 검색 중`
            : "글을 쓰고 있어요"}
        </h2>
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
          {phase === "search"
            ? "실제 매장 정보를 검색하여 정확한 내용을 준비하고 있어요"
            : "찾은 정보를 바탕으로 블로그 글을 작성하고 있어요"}
        </p>

        <div className="mt-6 w-full max-w-xs">
          <div className="space-y-2">
            <LoadingStep label="매장 정보 검색 중..." active={phase === "search"} done={phase === "generate"} />
            <LoadingStep label="메뉴, 리뷰, 영업정보 수집 중..." active={phase === "search"} done={phase === "generate"} />
            <LoadingStep label="블로그 글 작성 중..." active={phase === "generate"} done={false} />
            <LoadingStep label="SEO 최적화 중..." active={phase === "generate"} done={false} />
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--color-text-light)]">보통 1~2분 정도 걸려요</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
        <div className="w-14 h-14 mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <span className="text-2xl">😔</span>
        </div>
        <h2 className="text-lg font-bold mb-2">문제가 생겼어요</h2>
        <p className="text-sm text-[var(--color-text-light)] mb-6">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="h-11 px-6 rounded-xl text-sm font-semibold bg-white text-[var(--color-text)] border border-[var(--color-border)]">
            정보 수정하기
          </button>
          <button onClick={generatePost} className="h-11 px-6 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white">
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <StepLayout currentStep={2} totalSteps={3} title="이렇게 올릴까요?" description="만들어진 글을 확인해 보세요">
      <div className="mb-4">
        <p className="text-xs font-semibold text-[var(--color-text-light)] mb-1.5">제목</p>
        <div className="bg-white rounded-lg p-3 border border-[var(--color-border)]">
          <h2 className="text-base font-bold">{title}</h2>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-[var(--color-text-light)] mb-1.5">본문 미리보기</p>
        <div className="bg-white rounded-lg p-4 border border-[var(--color-border)] prose prose-sm max-w-none" style={{ fontSize: "14px", lineHeight: "1.7" }} dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <div className="mb-3">
        <button onClick={generatePost} className="w-full h-11 rounded-xl text-sm font-medium bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-gray-50 transition-colors">
          🔄 다시 써주세요
        </button>
      </div>

      <BigButton onClick={handleProceed} variant="success">이 글로 할게요</BigButton>
    </StepLayout>
  );
}

function LoadingStep({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 p-2.5 rounded-lg ${done ? "bg-green-50" : active ? "bg-blue-50" : "bg-gray-50"}`}>
      {done ? (
        <span className="text-green-500 text-sm font-bold">&#10003;</span>
      ) : active ? (
        <span className="inline-block w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <span className="inline-block w-4 h-4 rounded-full bg-gray-200" />
      )}
      <span className={`text-xs ${done ? "text-green-700" : active ? "text-blue-700" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}

export default function Step2() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="text-sm text-[var(--color-text-light)]">불러오는 중...</span></div>}>
      <Step2Content />
    </Suspense>
  );
}
