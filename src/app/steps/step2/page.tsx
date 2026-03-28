"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import BigButton from "@/components/BigButton";

function Step2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storeName = searchParams.get("storeName") || "";
  const storeAddress = searchParams.get("storeAddress") || "";
  const theme = searchParams.get("theme") || "";

  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"search" | "generate">("search");
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const generatePost = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError("");
    setPhase("search");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, storeAddress, theme }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "\uAE00 \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694");
      }

      const data = await res.json();
      setTitle(data.title);
      setHtml(data.html);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "\uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694."
      );
    } finally {
      setLoading(false);
    }
  }, [storeName, storeAddress, theme]);

  useEffect(() => {
    generatePost();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [generatePost]);

  // \uB85C\uB529 \uC2DC \uB2E8\uACC4 \uC804\uD658 \uC560\uB2C8\uBA54\uC774\uC158 (15\uCD08 \uD6C4 generate \uB2E8\uACC4\uB85C)
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setPhase("generate"), 15000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleProceed = () => {
    sessionStorage.setItem("blogTitle", title);
    sessionStorage.setItem("blogHtml", html);
    router.push("/steps/step3");
  };

  // \uB85C\uB529 \uC0C1\uD0DC
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-4xl animate-bounce">
            {phase === "search" ? "\uD83D\uDD0D" : "\u270D\uFE0F"}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-3">
          {phase === "search"
            ? `'${storeName}' \uB9E4\uC7A5 \uC815\uBCF4\uB97C \uCC3E\uACE0 \uC788\uC5B4\uC694`
            : "\uAE00\uC744 \uC4F0\uACE0 \uC788\uC5B4\uC694"}
        </h2>
        <p className="text-lg text-[var(--color-text-light)] leading-relaxed">
          {phase === "search"
            ? "\uC2E4\uC81C \uB9E4\uC7A5 \uC815\uBCF4\uB97C \uAC80\uC0C9\uD558\uC5EC\n\uC815\uD655\uD55C \uB0B4\uC6A9\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694"
            : "\uCC3E\uC740 \uC815\uBCF4\uB97C \uBC14\uD0D5\uC73C\uB85C\n\uBE14\uB85C\uADF8 \uAE00\uC744 \uC791\uC131\uD558\uACE0 \uC788\uC5B4\uC694"}
        </p>

        <div className="mt-8 w-full max-w-xs">
          <div className="space-y-3">
            <LoadingStep
              label={`'${storeName}' \uB9E4\uC7A5 \uC815\uBCF4 \uAC80\uC0C9 \uC911...`}
              active={phase === "search"}
              done={phase === "generate"}
            />
            <LoadingStep
              label="\uBA54\uB274, \uB9AC\uBDF0, \uC601\uC5C5\uC815\uBCF4 \uC218\uC9D1 \uC911..."
              active={phase === "search"}
              done={phase === "generate"}
            />
            <LoadingStep
              label="\uBE14\uB85C\uADF8 \uAE00 \uC791\uC131 \uC911..."
              active={phase === "generate"}
              done={false}
            />
            <LoadingStep
              label="SEO \uCD5C\uC801\uD654 \uC911..."
              active={phase === "generate"}
              done={false}
            />
          </div>
        </div>

        <p className="mt-6 text-base text-[var(--color-text-light)]">
          \uBCF4\uD1B5 1~2\uBD84 \uC815\uB3C4 \uAC78\uB824\uC694
        </p>
      </div>
    );
  }

  // \uC5D0\uB7EC \uC0C1\uD0DC
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">{"\uD83D\uDE14"}</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">\uBB38\uC81C\uAC00 \uC0DD\uACBC\uC5B4\uC694</h2>
        <p className="text-lg text-[var(--color-text-light)] mb-8">{error}</p>
        <button
          onClick={generatePost}
          className="h-14 px-8 rounded-2xl text-lg font-bold bg-[var(--color-primary)] text-white"
        >
          \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAE30
        </button>
      </div>
    );
  }

  // \uACB0\uACFC \uBBF8\uB9AC\uBCF4\uAE30
  return (
    <StepLayout
      currentStep={2}
      totalSteps={3}
      title="\uC774\uB807\uAC8C \uC62C\uB9B4\uAE4C\uC694?"
      description="\uB9CC\uB4E4\uC5B4\uC9C4 \uAE00\uC744 \uD655\uC778\uD574 \uBCF4\uC138\uC694"
    >
      {/* \uC81C\uBAA9 \uBBF8\uB9AC\uBCF4\uAE30 */}
      <div className="mb-6">
        <p className="text-base font-semibold text-[var(--color-text-light)] mb-2">
          \uC81C\uBAA9
        </p>
        <div className="bg-white rounded-xl p-4 border-2 border-[var(--color-border)]">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </div>

      {/* \uBCF8\uBB38 \uBBF8\uB9AC\uBCF4\uAE30 */}
      <div className="mb-6">
        <p className="text-base font-semibold text-[var(--color-text-light)] mb-2">
          \uBCF8\uBB38 \uBBF8\uB9AC\uBCF4\uAE30
        </p>
        <div
          className="bg-white rounded-xl p-5 border-2 border-[var(--color-border)] prose prose-lg max-w-none"
          style={{ fontSize: "17px", lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* \uB2E4\uC2DC\uC4F0\uAE30 \uBC84\uD2BC */}
      <div className="mb-4">
        <button
          onClick={generatePost}
          className="w-full h-14 rounded-2xl text-lg font-semibold bg-white text-[var(--color-text)] border-2 border-[var(--color-border)] hover:bg-gray-50 transition-colors"
        >
          {"\uD83D\uDD04"} \uB2E4\uC2DC \uC368\uC8FC\uC138\uC694
        </button>
      </div>

      <BigButton onClick={handleProceed} variant="success">
        \uC774 \uAE00\uB85C \uD560\uAC8C\uC694
      </BigButton>
    </StepLayout>
  );
}

function LoadingStep({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${
        done ? "bg-green-50" : active ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      {done ? (
        <span className="text-green-500 font-bold">{"\u2713"}</span>
      ) : active ? (
        <span className="inline-block w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        <span className="inline-block w-5 h-5 rounded-full bg-gray-200" />
      )}
      <span
        className={`text-base ${
          done ? "text-green-700" : active ? "text-blue-700" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function Step2() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-xl text-[var(--color-text-light)]">\uBD88\uB7EC\uC624\uB294 \uC911...</span>
        </div>
      }
    >
      <Step2Content />
    </Suspense>
  );
}
