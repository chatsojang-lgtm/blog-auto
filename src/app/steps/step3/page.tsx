"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Step3() {
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
    if (!savedTitle && !savedHtml) router.push("/steps/step1");
  }, [router]);

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

  async function copyToClipboard(type: "title" | "body" | "all") {
    let textToCopy = "";
    let htmlToCopy = "";
    if (type === "title") { textToCopy = title; htmlToCopy = title; }
    else if (type === "body") { textToCopy = htmlToPlainText(html); htmlToCopy = html; }
    else { textToCopy = title + "\n\n" + htmlToPlainText(html); htmlToCopy = `<h1>${title}</h1>\n${html}`; }

    try {
      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new ClipboardItem({
          "text/html": new Blob([htmlToCopy], { type: "text/html" }),
          "text/plain": new Blob([textToCopy], { type: "text/plain" }),
        })]);
      } else { await navigator.clipboard.writeText(textToCopy); }
      setCopied(true); setCopyType(type);
      setTimeout(() => { setCopied(false); setCopyType(""); }, 2000);
    } catch {
      const ta = document.createElement("textarea"); ta.value = textToCopy;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(true); setCopyType(type);
      setTimeout(() => { setCopied(false); setCopyType(""); }, 2000);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 pt-4 pb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-text-light)]">3 / 3</span>
        </div>
        <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-success)] rounded-full transition-all duration-500" style={{ width: "100%" }} />
        </div>
      </div>

      <div className="px-4 pt-5 pb-3 text-center">
        <div className="w-14 h-14 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center">
          <span className="text-2xl">{"\u2728"}</span>
        </div>
        <h1 className="text-xl font-bold mb-1">글이 완성됐어요!</h1>
        <p className="text-sm text-[var(--color-text-light)]">아래 순서대로 블로그에 올려보세요</p>
      </div>

      <div className="px-4 space-y-2 mb-6">
        <button onClick={() => copyToClipboard("title")} className={`w-full p-3.5 rounded-xl border text-left transition-all ${copied && copyType === "title" ? "border-green-400 bg-green-50" : "border-[var(--color-border)] bg-white hover:border-blue-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-text-light)] mb-0.5">제목</p>
              <p className="text-sm font-semibold truncate">{title}</p>
            </div>
            <span className="text-xl flex-shrink-0 ml-2">{copied && copyType === "title" ? "\u2705" : "\uD83D\uDCCB"}</span>
          </div>
          {copied && copyType === "title" && <p className="text-green-600 text-xs font-semibold mt-1">제목이 복사됐어요!</p>}
        </button>

        <button onClick={() => copyToClipboard("body")} className={`w-full p-3.5 rounded-xl border text-left transition-all ${copied && copyType === "body" ? "border-green-400 bg-green-50" : "border-[var(--color-border)] bg-white hover:border-blue-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-text-light)] mb-0.5">본문 내용</p>
              <p className="text-sm font-semibold">{"\uD83D\uDCCB"} 본문 복사하기</p>
            </div>
            <span className="text-xl flex-shrink-0 ml-2">{copied && copyType === "body" ? "\u2705" : "\uD83D\uDCCB"}</span>
          </div>
          {copied && copyType === "body" && <p className="text-green-600 text-xs font-semibold mt-1">본문이 복사됐어요!</p>}
        </button>

        <button onClick={() => copyToClipboard("all")} className={`w-full p-4 rounded-xl border text-center transition-all text-base font-bold ${copied && copyType === "all" ? "border-green-400 bg-green-50 text-green-700" : "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] hover:bg-blue-100"}`}>
          {copied && copyType === "all" ? "\u2705 전체가 복사됐어요!" : "\uD83D\uDCCB 제목 + 본문 한번에 복사"}
        </button>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[var(--color-border)]">
          <h3 className="text-sm font-bold mb-3">{"\uD83D\uDCDD"} 블로그에 올리는 방법</h3>
          <div className="space-y-3">
            <GuideStep number={1} title="네이버 블로그 열기" description="아래 버튼을 눌러 블로그를 열어주세요" />
            <GuideStep number={2} title={'"글쓰기" 버튼 누르기'} description="블로그 화면 위쪽의 초록색 글쓰기 버튼" />
            <GuideStep number={3} title="제목 붙여넣기" description="제목 복사 후 제목 칸에 붙여넣기" />
            <GuideStep number={4} title="본문 붙여넣기" description="본문 복사 후 글 내용 칸에 붙여넣기" />
            <GuideStep number={5} title={'"발행" 버튼 누르기'} description="오른쪽 위의 발행 버튼을 누르면 끝!" />
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <a href="https://blog.naver.com/MyBlog.naver" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 w-full h-12 rounded-xl text-base font-semibold bg-[#03C75A] hover:bg-[#02b350] text-white transition-all duration-200 active:scale-[0.98]">
          네이버 블로그 열기
        </a>
      </div>

      <div className="px-4 pb-8">
        <button onClick={() => { sessionStorage.removeItem("blogTitle"); sessionStorage.removeItem("blogHtml"); router.push("/"); }} className="w-full h-11 rounded-xl text-sm font-medium bg-white text-[var(--color-text-light)] border border-[var(--color-border)] hover:bg-gray-50 transition-colors">
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function GuideStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">{number}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-[var(--color-text-light)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}
