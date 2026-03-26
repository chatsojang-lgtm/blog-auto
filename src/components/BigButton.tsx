"use client";

interface BigButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "success" | "secondary";
  disabled?: boolean;
  loading?: boolean;
}

export default function BigButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
}: BigButtonProps) {
  const baseClasses =
    "fixed bottom-0 left-0 right-0 mx-auto max-w-lg w-full px-5 pb-6 pt-3 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-10";

  const buttonColors = {
    primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white",
    success: "bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white",
    secondary: "bg-white hover:bg-gray-50 text-[var(--color-text)] border-2 border-[var(--color-border)]",
  };

  return (
    <div className={baseClasses}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          w-full h-16 rounded-2xl text-xl font-bold
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg
          flex items-center justify-center gap-2
          ${buttonColors[variant]}
        `}
      >
        {loading ? (
          <>
            <span className="inline-block w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <span>잠시만 기다려 주세요...</span>
          </>
        ) : (
          children
        )}
      </button>
    </div>
  );
}
