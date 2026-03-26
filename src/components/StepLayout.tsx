"use client";

interface StepLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function StepLayout({
  currentStep,
  totalSteps,
  title,
  description,
  children,
}: StepLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 진행바 */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-[var(--color-text-light)]">
            {currentStep} / {totalSteps} 단계
          </span>
        </div>
        <div className="w-full h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* 제목 영역 */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-base text-[var(--color-text-light)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* 콘텐츠 영역 - 스크롤 가능 */}
      <div className="flex-1 px-5 pb-32">{children}</div>
    </div>
  );
}
