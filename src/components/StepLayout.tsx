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
      <div className="px-4 pt-4 pb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-light)]">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold leading-tight tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-light)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex-1 px-4 pb-28">{children}</div>
    </div>
  );
}
