"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";

const THEMES = [
  { icon: "🎉", label: "매장 이벤트 홍보", value: "매장 이벤트 홍보" },
  { icon: "💰", label: "할인 행사 홍보", value: "할인 행사 홍보" },
  { icon: "🍽️", label: "신메뉴 안내", value: "신메뉴 안내" },
  { icon: "📍", label: "매장 위치 안내", value: "매장 위치 안내" },
  { icon: "⭐", label: "방문 후기 리뷰", value: "방문 후기 리뷰" },
];

export default function Step1() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const activeTheme = isCustom ? customTheme.trim() : selectedTheme;
  const canProceed =
    storeName.trim().length > 0 &&
    storeAddress.trim().length > 0 &&
    activeTheme.length > 0;

  const handleThemeSelect = (value: string) => {
    setSelectedTheme(value);
    setIsCustom(false);
    setCustomTheme("");
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setSelectedTheme("");
  };

  const handleNext = () => {
    if (!canProceed) return;
    const params = new URLSearchParams({
      storeName: storeName.trim(),
      storeAddress: storeAddress.trim(),
      theme: activeTheme,
    });
    router.push(`/steps/step2?${params.toString()}`);
  };

  return (
    <StepLayout
      currentStep={1}
      totalSteps={3}
      title="매장 정보를 알려주세요"
      description="정확한 정보를 입력하면 더 좋은 글이 나와요"
    >
      <div className="mb-5">
        <label htmlFor="storeName" className="block text-sm font-semibold mb-1.5">
          매장 이름
        </label>
        <input
          id="storeName"
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="예) 맛있는 삼겹살집"
          className="
            w-full h-11 px-4 rounded-lg border border-[var(--color-border)]
            text-sm bg-white
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      <div className="mb-6">
        <label htmlFor="storeAddress" className="block text-sm font-semibold mb-1.5">
          매장 주소
        </label>
        <p className="text-xs text-[var(--color-text-light)] mb-1.5">
          정확한 주소를 입력해야 올바른 매장 정보를 찾을 수 있어요
        </p>
        <input
          id="storeAddress"
          type="text"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
          placeholder="예) 서울시 강남구 역삼동 123-45"
          className="
            w-full h-11 px-4 rounded-lg border border-[var(--color-border)]
            text-sm bg-white
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      <div className="mb-5">
        <p className="text-sm font-semibold mb-2.5">블로그 글 테마</p>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => handleThemeSelect(t.value)}
              className={`
                flex flex-col items-center gap-1.5 p-3 rounded-xl border
                transition-all duration-200 active:scale-[0.97]
                ${
                  !isCustom && selectedTheme === t.value
                    ? "border-[var(--color-primary)] bg-blue-50/80 shadow-sm"
                    : "border-[var(--color-border)] bg-white hover:border-blue-200"
                }
              `}
            >
              <span className="text-xl">{t.icon}</span>
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  !isCustom && selectedTheme === t.value
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text)]"
                }`}
              >
                {t.label}
              </span>
            </button>
          ))}

          <button
            onClick={handleCustomSelect}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-xl border
              transition-all duration-200 active:scale-[0.97]
              ${
                isCustom
                  ? "border-[var(--color-primary)] bg-blue-50/80 shadow-sm"
                  : "border-[var(--color-border)] bg-white hover:border-blue-200"
              }
            `}
          >
            <span className="text-xl">✏️</span>
            <span
              className={`text-xs font-medium text-center leading-tight ${
                isCustom ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"
              }`}
            >
              이외
            </span>
          </button>
        </div>

        {isCustom && (
          <div className="mt-3">
            <input
              type="text"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              placeholder="원하시는 테마를 직접 입력해주세요"
              autoFocus
              className="
                w-full h-11 px-4 rounded-lg border border-[var(--color-primary)]
                text-sm bg-white
                focus:border-[var(--color-primary)] focus:outline-none
                transition-colors placeholder:text-gray-400
              "
            />
          </div>
        )}
      </div>

      <BigButton onClick={handleNext} disabled={!canProceed}>
        다음으로
      </BigButton>
    </StepLayout>
  );
}
