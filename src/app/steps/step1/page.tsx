"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";

const THEMES = [
  { icon: "\uD83C\uDF89", label: "\uB9E4\uC7A5 \uC774\uBCA4\uD2B8 \uD64D\uBCF4", value: "\uB9E4\uC7A5 \uC774\uBCA4\uD2B8 \uD64D\uBCF4" },
  { icon: "\uD83D\uDCB0", label: "\uD560\uC778 \uD589\uC0AC \uD64D\uBCF4", value: "\uD560\uC778 \uD589\uC0AC \uD64D\uBCF4" },
  { icon: "\uD83C\uDF7D\uFE0F", label: "\uC2E0\uBA54\uB274 \uC548\uB0B4", value: "\uC2E0\uBA54\uB274 \uC548\uB0B4" },
  { icon: "\uD83D\uDCCD", label: "\uB9E4\uC7A5 \uC704\uCE58 \uC548\uB0B4", value: "\uB9E4\uC7A5 \uC704\uCE58 \uC548\uB0B4" },
  { icon: "\u2B50", label: "\uBC29\uBB38 \uD6C4\uAE30 \uB9AC\uBDF0", value: "\uBC29\uBB38 \uD6C4\uAE30 \uB9AC\uBDF0" },
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
      title="\uB9E4\uC7A5 \uC815\uBCF4\uB97C \uC54C\uB824\uC8FC\uC138\uC694"
      description="\uC815\uD655\uD55C \uC815\uBCF4\uB97C \uC785\uB825\uD558\uBA74 \uB354 \uC88B\uC740 \uAE00\uC774 \uB098\uC640\uC694"
    >
      {/* \uB9E4\uC7A5 \uC774\uB984 \uC785\uB825 */}
      <div className="mb-6">
        <label htmlFor="storeName" className="block text-lg font-semibold mb-2">
          \uB9E4\uC7A5 \uC774\uB984
        </label>
        <input
          id="storeName"
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="\uC608) \uB9DB\uC788\uB294 \uC0BC\uACA9\uC0B4\uC9D1"
          className="
            w-full h-14 px-5 rounded-xl border-2 border-[var(--color-border)]
            text-lg bg-white
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      {/* \uB9E4\uC7A5 \uC8FC\uC18C \uC785\uB825 */}
      <div className="mb-8">
        <label htmlFor="storeAddress" className="block text-lg font-semibold mb-2">
          \uB9E4\uC7A5 \uC8FC\uC18C
        </label>
        <p className="text-base text-[var(--color-text-light)] mb-2">
          \uC815\uD655\uD55C \uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC57C \uC62C\uBC14\uB978 \uB9E4\uC7A5 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC788\uC5B4\uC694
        </p>
        <input
          id="storeAddress"
          type="text"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
          placeholder="\uC608) \uC11C\uC6B8\uC2DC \uAC15\uB0A8\uAD6C \uC5ED\uC0BC\uB3D9 123-45"
          className="
            w-full h-14 px-5 rounded-xl border-2 border-[var(--color-border)]
            text-lg bg-white
            focus:border-[var(--color-primary)] focus:outline-none
            transition-colors placeholder:text-gray-400
          "
        />
      </div>

      {/* \uBE14\uB85C\uADF8 \uD14C\uB9C8 \uC120\uD0DD */}
      <div className="mb-6">
        <p className="text-lg font-semibold mb-3">\uBE14\uB85C\uADF8 \uAE00 \uD14C\uB9C8</p>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => handleThemeSelect(t.value)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-2xl border-2
                transition-all duration-200 active:scale-[0.97]
                ${
                  !isCustom && selectedTheme === t.value
                    ? "border-[var(--color-primary)] bg-blue-50 shadow-md"
                    : "border-[var(--color-border)] bg-white hover:border-blue-300"
                }
              `}
            >
              <span className="text-3xl">{t.icon}</span>
              <span
                className={`text-base font-semibold text-center leading-tight ${
                  !isCustom && selectedTheme === t.value
                    ? "text-[var(--color-primary)]"
                    : ""
                }`}
              >
                {t.label}
              </span>
            </button>
          ))}

          {/* \uC774\uC678 \uBC84\uD2BC */}
          <button
            onClick={handleCustomSelect}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl border-2
              transition-all duration-200 active:scale-[0.97]
              ${
                isCustom
                  ? "border-[var(--color-primary)] bg-blue-50 shadow-md"
                  : "border-[var(--color-border)] bg-white hover:border-blue-300"
              }
            `}
          >
            <span className="text-3xl">{"\u270F\uFE0F"}</span>
            <span
              className={`text-base font-semibold text-center leading-tight ${
                isCustom ? "text-[var(--color-primary)]" : ""
              }`}
            >
              \uC774\uC678
            </span>
          </button>
        </div>

        {/* \uC9C1\uC811 \uC785\uB825 \uD544\uB4DC */}
        {isCustom && (
          <div className="mt-4">
            <input
              type="text"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              placeholder="\uC6D0\uD558\uC2DC\uB294 \uD14C\uB9C8 \uC8FC\uC81C\uB97C \uC9C1\uC811 \uC785\uB825\uD574\uC8FC\uC138\uC694"
              autoFocus
              className="
                w-full h-14 px-5 rounded-xl border-2 border-[var(--color-primary)]
                text-lg bg-white
                focus:border-[var(--color-primary)] focus:outline-none
                transition-colors placeholder:text-gray-400
              "
            />
          </div>
        )}
      </div>

      <BigButton onClick={handleNext} disabled={!canProceed}>
        \uB2E4\uC74C\uC73C\uB85C
      </BigButton>
    </StepLayout>
  );
}
