"use client";

interface CategoryCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  icon,
  label,
  selected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2
        p-5 rounded-2xl border-2 transition-all duration-200
        active:scale-[0.97]
        ${
          selected
            ? "border-[var(--color-primary)] bg-blue-50 shadow-md"
            : "border-[var(--color-border)] bg-white hover:border-blue-300"
        }
      `}
    >
      <span className="text-4xl">{icon}</span>
      <span className={`text-lg font-semibold ${selected ? "text-[var(--color-primary)]" : ""}`}>
        {label}
      </span>
    </button>
  );
}
