"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";

function Step3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeName = searchParams.get("storeName") || "";
  const category = searchParams.get("category") || "";
  const topic = searchParams.get("topic") || "";
  const keyword = searchParams.get("keyword") || "";
  const extraInfo = searchParams.get("extraInfo") || "";

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  const generatePost = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, category, topic, keyword, extraInfo }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "글 생성에 실패했어요");
      }

      const data = await res.json();
      setTitle(data.title);
      setHtml(data.html);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문제가 발생했어요. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  }, [storeName, category, topic, keyword, extraInfo]);

  useEffect(() => {
    generatePost();
  }, [generatePost]);

  const handleProceed = () => {
    // Step4로 이동 - title과 html을 sessionStorage에 저장
    sessionStorage.setItem("blogTitle", title);
    sessionStorage.setItem("blogHtml", html);
    router.push("/steps/step4");
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-4xl animate-bounce">&#9997;&#65039;</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">글을 쓰고 있어요</h2>
        <p className="text-lg text-[var(--color-text-light)] leading-relaxed">
          잠시만 기다려 주세요
          <br />
          보통 30초~1분 정도 걸려요
        </p>

        {/* 진행 애니메이션 */}
        <div className="mt-8 w-full max-w-xs">
          <div className="space-y-3">
            <LoadingStep label="글 주제 분석 중..." active={true} />
            <LoadingStep label="서론 작성 중..." active={true} />
            <LoadingStep label="본문 작성 중..." active={true} />
            <LoadingStep label="마무리 중..." active={true} />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">&#128532;</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">문제가 생겼어요</h2>
        <p className="text-lg text-[var(--color-text-light)] mb-8">{error}</p>
        <button
          onClick={generatePost}
          className="h-14 px-8 rounded-2xl text-lg font-bold bg-[var(--color-primary)] text-white"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // 결과 미리보기
  return (
    <StepLayout
      currentStep={3}
      totalSteps={4}
      title="이렇게 올릴까요?"
      description="만들어진 글을 확인해 보세요"
    >
      {/* 제목 미리보기 */}
      <div className="mb-6">
        <p className="text-base font-semibold text-[var(--color-text-light)] mb-2">
          제목
        </p>
        <div className="bg-white rounded-xl p-4 border-2 border-[var(--color-border)]">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </div>

      {/* 본문 미리보기 */}
      <div className="mb-6">
        <p className="text-base font-semibold text-[var(--color-text-light)] mb-2">
          본문 미리보기
        </p>
        <div
          className="bg-white rounded-xl p-5 border-2 border-[var(--color-border)] prose prose-lg max-w-none"
          style={{ fontSize: "17px", lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* 다시쓰기 버튼 */}
      <div className="mb-4">
        <button
          onClick={generatePost}
          className="w-full h-14 rounded-2xl text-lg font-semibold bg-white text-[var(--color-text)] border-2 border-[var(--color-border)] hover:bg-gray-50 transition-colors"
        >
          &#128260; 다시 써주세요
        </button>
      </div>

      <BigButton onClick={handleProceed} variant="success">
        이 글로 할게요
      </BigButton>
    </StepLayout>
  );
}

function LoadingStep({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${
        active ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      {active ? (
        <span className="inline-block w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        <span className="text-green-500">&#10003;</span>
      )}
      <span className={`text-base ${active ? "text-blue-700" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

export default function Step3() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-xl text-[var(--color-text-light)]">불러오는 중...</span>
        </div>
      }
    >
      <Step3Content />
    </Suspense>
  );
}
