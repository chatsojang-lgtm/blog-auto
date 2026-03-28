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
    "fixed bottom-0 left-0 right-0 mx-auto max-w-lg w-full px-4 pb-5 pt-2 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-10";

  const buttonColors = {
    primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white",
    success: "bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white",
    secondary: "bg-white hover:bg-gray-50 text-[var(--color-text)] border border-[var(--color-border)]",
  };

  return (
    <div className={baseClasses}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          w-full h-12 rounded-xl text-base font-semibold
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
          ${buttonColors[variant]}
        `}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>잠시만요...</span>
          </>
        ) : (
          children
        )}
      </button>
    </div>
  );
}
