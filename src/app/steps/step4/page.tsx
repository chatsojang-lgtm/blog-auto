"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Step4() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyType, setCopyType] = useState<"" | "title" | "body" | "all">("");

  useEffect(() => {
    const savedTitle = sessionStorage.getItem("blogTitle") || "";
    const savedHtml = sessionStorage.getItem("blogHtml") || "";
    setTitle(savedTitle);
    setHtml(savedHtml);

    if (!savedTitle && !savedHtml) {
      router.push("/steps/step1");
    }
  }, [router]);

  /** HTML을 일반 텍스트로 변환 (네이버 스마트에디터 붙여넣기용) */
  function htmlToPlainText(htmlStr: string): string {
    return htmlStr
      .replace(/<h[23][^>]*>/gi, "\n\n★ ")
      .replace(/<\/h[23]>/gi, " ★\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li>/gi, "\n• ")
      .replace(/<\/li>/gi, "")
      .replace(/<strong>/gi, "**")
      .replace(/<\/strong>/gi, "**")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /** 클립보드 복사 (HTML + 일반텍스트 동시) */
  async function copyToClipboard(type: "title" | "body" | "all") {
    let textToCopy = "";
    let htmlToCopy = "";

    if (type === "title") {
      textToCopy = title;
      htmlToCopy = title;
    } else if (type === "body") {
      textToCopy = htmlToPlainText(html);
      htmlToCopy = html;
    } else {
      textToCopy = title + "\n\n" + htmlToPlainText(html);
      htmlToCopy = `<h1>${title}</h1>\n${html}`;
    }

    try {
      // 리치 텍스트 복사 시도 (HTML 형태 유지)
      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        const blob = new Blob([htmlToCopy], { type: "text/html" });
        const textBlob = new Blob([textToCopy], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blob,
            "text/plain": textBlob,
          }),
        ]);
      } else {
        // 폴백: 일반 텍스트 복사
        await navigator.clipboard.writeText(textToCopy);
      }

      setCopied(true);
      setCopyType(type);
      setTimeout(() => {
        setCopied(false);
        setCopyType("");
      }, 2000);
    } catch {
      // 최종 폴백
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setCopyType(type);
      setTimeout(() => {
        setCopied(false);
        setCopyType("");
      }, 2000);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 진행바 */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-[var(--color-text-light)]">
            4 / 4 단계
          </span>
        </div>
        <div className="w-full h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-success)] rounded-full transition-all duration-500"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* 완료 헤더 */}
      <div className="px-5 pt-6 pb-4 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">&#10024;</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">글이 완성됐어요!</h1>
        <p className="text-lg text-[var(--color-text-light)]">
          아래 순서대로 블로그에 올려보세요
        </p>
      </div>

      {/* 복사 버튼 영역 */}
      <div className="px-5 space-y-3 mb-8">
        {/* 제목 복사 */}
        <button
          onClick={() => copyToClipboard("title")}
          className={`
            w-full p-5 rounded-2xl border-2 text-left transition-all
            ${
              copied && copyType === "title"
                ? "border-green-500 bg-green-50"
                : "border-[var(--color-border)] bg-white hover:border-blue-300"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-[var(--color-text-light)] mb-1">
                제목
              </p>
              <p className="text-lg font-semibold truncate">{title}</p>
            </div>
            <span className="text-3xl flex-shrink-0 ml-3">
              {copied && copyType === "title" ? "\u2705" : "\uD83D\uDCCB"}
            </span>
          </div>
          {copied && copyType === "title" && (
            <p className="text-green-600 font-semibold mt-2">
              제목이 복사됐어요!
            </p>
          )}
        </button>

        {/* 본문 복사 */}
        <button
          onClick={() => copyToClipboard("body")}
          className={`
            w-full p-5 rounded-2xl border-2 text-left transition-all
            ${
              copied && copyType === "body"
                ? "border-green-500 bg-green-50"
                : "border-[var(--color-border)] bg-white hover:border-blue-300"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-[var(--color-text-light)] mb-1">
                본문 내용
              </p>
              <p className="text-lg font-semibold">
                &#128203; 본문 복사하기
              </p>
            </div>
            <span className="text-3xl flex-shrink-0 ml-3">
              {copied && copyType === "body" ? "\u2705" : "\uD83D\uDCCB"}
            </span>
          </div>
          {copied && copyType === "body" && (
            <p className="text-green-600 font-semibold mt-2">
              본문이 복사됐어요!
            </p>
          )}
        </button>

        {/* 전체 복사 (큰 버튼) */}
        <button
          onClick={() => copyToClipboard("all")}
          className={`
            w-full p-6 rounded-2xl border-2 text-center transition-all text-xl font-bold
            ${
              copied && copyType === "all"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] hover:bg-blue-100"
            }
          `}
        >
          {copied && copyType === "all"
            ? "\u2705 전체가 복사됐어요!"
            : "\uD83D\uDCCB 제목 + 본문 한번에 복사하기"}
        </button>
      </div>

      {/* 발행 가이드 */}
      <div className="px-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border-2 border-[var(--color-border)]">
          <h3 className="text-xl font-bold mb-4">
            &#128221; 블로그에 올리는 방법
          </h3>

          <div className="space-y-5">
            <GuideStep
              number={1}
              title="네이버 블로그 열기"
              description='아래 버튼을 눌러 블로그를 열어주세요'
            />
            <GuideStep
              number={2}
              title='"글쓰기" 버튼 누르기'
              description="블로그 화면 위쪽에 있는 초록색 글쓰기 버튼을 눌러주세요"
            />
            <GuideStep
              number={3}
              title="제목 붙여넣기"
              description='위에서 "제목 복사하기"를 누른 뒤, 제목 칸에 붙여넣기 해주세요'
            />
            <GuideStep
              number={4}
              title="본문 붙여넣기"
              description='"본문 복사하기"를 누른 뒤, 글 내용 칸에 붙여넣기 해주세요'
            />
            <GuideStep
              number={5}
              title='"발행" 버튼 누르기'
              description="오른쪽 위의 발행 버튼을 누르면 끝이에요!"
            />
          </div>
        </div>
      </div>

      {/* 네이버 블로그 바로가기 */}
      <div className="px-5 mb-6">
        <a
          href="https://blog.naver.com/MyBlog.naver"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-2
            w-full h-16 rounded-2xl text-xl font-bold
            bg-[#03C75A] hover:bg-[#02b350] text-white
            shadow-lg transition-all duration-200 active:scale-[0.98]
          "
        >
          &#128994; 네이버 블로그 열기
        </a>
      </div>

      {/* 처음으로 */}
      <div className="px-5 pb-10">
        <button
          onClick={() => {
            sessionStorage.removeItem("blogTitle");
            sessionStorage.removeItem("blogHtml");
            router.push("/");
          }}
          className="
            w-full h-14 rounded-2xl text-lg font-semibold
            bg-white text-[var(--color-text-light)] border-2 border-[var(--color-border)]
            hover:bg-gray-50 transition-colors
          "
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function GuideStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-lg font-bold">
        {number}
      </div>
      <div className="flex-1">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-base text-[var(--color-text-light)] mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}
