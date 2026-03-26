"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";

const TOPIC_TEMPLATES: Record<string, { icon: string; label: string; value: string }[]> = {
  "맛집/음식점": [
    { icon: "\uD83C\uDF56", label: "인기 메뉴 소개", value: "인기 메뉴 소개" },
    { icon: "\uD83C\uDFE0", label: "우리 가게 소개", value: "가게 소개" },
    { icon: "\uD83C\uDF89", label: "이벤트/할인 소식", value: "이벤트 소식" },
    { icon: "\uD83D\uDC68\u200D\uD83C\uDF73", label: "사장님 이야기", value: "사장님 이야기" },
  ],
  "미용실/헤어샵": [
    { icon: "\uD83D\uDC87", label: "시술 후기/사례", value: "시술 사례" },
    { icon: "\uD83C\uDFE0", label: "우리 샵 소개", value: "샵 소개" },
    { icon: "\u2728", label: "이달의 스타일 추천", value: "스타일 추천" },
    { icon: "\uD83D\uDCB0", label: "가격/이벤트 안내", value: "가격 안내" },
  ],
  "헬스장/PT": [
    { icon: "\uD83C\uDFCB\uFE0F", label: "회원 변화 후기", value: "회원 후기" },
    { icon: "\uD83C\uDFE0", label: "시설 소개", value: "시설 소개" },
    { icon: "\uD83D\uDCAA", label: "운동 팁/노하우", value: "운동 팁" },
    { icon: "\uD83C\uDF89", label: "이벤트/할인 안내", value: "이벤트 안내" },
  ],
  default: [
    { icon: "\uD83C\uDFE0", label: "우리 가게 소개", value: "가게 소개" },
    { icon: "\u2B50", label: "인기 상품/서비스", value: "인기 서비스" },
    { icon: "\uD83C\uDF89", label: "이벤트/소식", value: "이벤트 소식" },
    { icon: "\uD83D\uDDE3\uFE0F", label: "사장님 이야기", value: "사장님 이야기" },
  ],
};

function Step2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeName = searchParams.get("storeName") || "";
  const category = searchParams.get("category") || "";

  const [selectedTopic, setSelectedTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  const topics = TOPIC_TEMPLATES[category] || TOPIC_TEMPLATES["default"];
  const canProceed = selectedTopic.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    const params = new URLSearchParams({
      storeName,
      category,
      topic: selectedTopic,
      keyword: keyword.trim(),
      extraInfo: extraInfo.trim(),
    });
    router.push(`/steps/step3?${params.toString()}`);
  };

  return (
    <StepLayout
      currentStep={2}
      totalSteps={4}
      title="어떤 글을 쓸까요?"
      description={`'${storeName}' 블로그에 올릴 글의 주제를 골라주세요`}
    >
      {/* 주제 선택 */}
      <div className="mb-8">
        <p className="text-lg font-semibold mb-3">글 주제 고르기</p>
        <div className="grid grid-cols-2 gap-3">
          {topics.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedTopic(t.value)}
              className={`
                flex flex-col items-center gap-2 p-5 rounded-2xl border-2
                transition-all duration-200 active:scale-[0.97]
                ${
                  selectedTopic === t.value
                    ? "border-[var(--color-primary)] bg-blue-50 shadow-md"
                    : "border-[var(--color-border)] bg-white hover:border-blue-300"
                }
              `}
            >
              <span className="text-3xl">{t.icon}</span>
              <span
                className={`text-lg font-semibold ${
                  selectedTopic === t.value ? "text-[var(--color-primary)]" : ""
                }`}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 검색어 입력 (선택) */}
      <div className="mb-6">
        <label htmlFor="keyword" className="block text-lg font-semibold mb-2">
          검색어 (선택사항)
        </label>
        <p className="text-base text-[var(--color-text-light)] mb-3">
          손님들이 검색할 만한 단어를 적어주세요
        </p>
        <input
          id="keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예) 강남역 맛집, 홍대 미용실"
          className="
            w-full h-14 px-5 rounded-xl border-2 border-[var(--color-border)]
            text-lg bg-white
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      {/* 추가 정보 (선택) */}
      <div className="mb-6">
        <label htmlFor="extraInfo" className="block text-lg font-semibold mb-2">
          추가로 알려줄 내용 (선택사항)
        </label>
        <p className="text-base text-[var(--color-text-light)] mb-3">
          가게의 특별한 점을 적어주시면 더 좋은 글이 나와요
        </p>
        <textarea
          id="extraInfo"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          placeholder="예) 주차 가능, 20년 경력 원장님, 시그니처 메뉴는 숙성 삼겹살"
          rows={3}
          className="
            w-full px-5 py-4 rounded-xl border-2 border-[var(--color-border)]
            text-lg bg-white resize-none
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      <BigButton onClick={handleNext} disabled={!canProceed} variant="success">
        글 만들어 주세요
      </BigButton>
    </StepLayout>
  );
}

export default function Step2() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-xl text-[var(--color-text-light)]">불러오는 중...</span>
        </div>
      }
    >
      <Step2Content />
    </Suspense>
  );
}
