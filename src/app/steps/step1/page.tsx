"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";
import CategoryCard from "@/components/CategoryCard";

const CATEGORIES = [
  { icon: "\uD83C\uDF5C", label: "맛집/음식점" },
  { icon: "\u2702\uFE0F", label: "미용실/헤어샵" },
  { icon: "\uD83D\uDCAA", label: "헬스장/PT" },
  { icon: "\uD83E\uDDD6", label: "피부관리/뷰티" },
  { icon: "\u2615", label: "카페/디저트" },
  { icon: "\uD83D\uDECD\uFE0F", label: "기타 매장" },
];

export default function Step1() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");

  const canProceed = storeName.trim().length > 0 && category.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    const params = new URLSearchParams({
      storeName: storeName.trim(),
      category,
    });
    router.push(`/steps/step2?${params.toString()}`);
  };

  return (
    <StepLayout
      currentStep={1}
      totalSteps={4}
      title="어떤 가게인가요?"
      description="가게 이름과 종류를 알려주세요"
    >
      {/* 가게 이름 입력 */}
      <div className="mb-8">
        <label
          htmlFor="storeName"
          className="block text-lg font-semibold mb-3"
        >
          가게 이름
        </label>
        <input
          id="storeName"
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="예) 맛있는 삼겹살집"
          className="
            w-full h-14 px-5 rounded-xl border-2 border-[var(--color-border)]
            text-lg bg-white
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      {/* 업종 선택 */}
      <div>
        <p className="text-lg font-semibold mb-3">가게 종류</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              selected={category === cat.label}
              onClick={() => setCategory(cat.label)}
            />
          ))}
        </div>
      </div>

      <BigButton onClick={handleNext} disabled={!canProceed}>
        다음으로
      </BigButton>
    </StepLayout>
  );
}
