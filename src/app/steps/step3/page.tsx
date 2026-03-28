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

    if (!savedTitle && !savedHtml) {
      router.push("/steps/step1");
    }
  }, [router]);

  function htmlToPlainText(htmlStr: string): string {
    return htmlStr
      .replace(/<h[23][^>]*>/gi, "\n\n\u2605 ")
      .replace(/<\/h[23]>/gi, " \u2605\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li>/gi, "\n\u2022 ")
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
        await navigator.clipboard.writeText(textToCopy);
      }

      setCopied(true);
      setCopyType(type);
      setTimeout(() => {
        setCopied(false);
        setCopyType("");
      }, 2000);
    } catch {
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
      {/* \uC0C1\uB2E8 \uC9C4\uD589\uBC14 */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-[var(--color-text-light)]">
            3 / 3 \uB2E8\uACC4
          </span>
        </div>
        <div className="w-full h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-success)] rounded-full transition-all duration-500"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* \uC644\uB8CC \uD5E4\uB354 */}
      <div className="px-5 pt-6 pb-4 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">{"\u2728"}</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">\uAE00\uC774 \uC644\uC131\uB410\uC5B4\uC694!</h1>
        <p className="text-lg text-[var(--color-text-light)]">
          \uC544\uB798 \uC21C\uC11C\uB300\uB85C \uBE14\uB85C\uADF8\uC5D0 \uC62C\uB824\uBCF4\uC138\uC694
        </p>
      </div>

      {/* \uBCF5\uC0AC \uBC84\uD2BC \uC601\uC5ED */}
      <div className="px-5 space-y-3 mb-8">
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
                \uC81C\uBAA9
              </p>
              <p className="text-lg font-semibold truncate">{title}</p>
            </div>
            <span className="text-3xl flex-shrink-0 ml-3">
              {copied && copyType === "title" ? "\u2705" : "\uD83D\uDCCB"}
            </span>
          </div>
          {copied && copyType === "title" && (
            <p className="text-green-600 font-semibold mt-2">
              \uC81C\uBAA9\uC774 \uBCF5\uC0AC\uB410\uC5B4\uC694!
            </p>
          )}
        </button>

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
                \uBCF8\uBB38 \uB0B4\uC6A9
              </p>
              <p className="text-lg font-semibold">
                {"\uD83D\uDCCB"} \uBCF8\uBB38 \uBCF5\uC0AC\uD558\uAE30
              </p>
            </div>
            <span className="text-3xl flex-shrink-0 ml-3">
              {copied && copyType === "body" ? "\u2705" : "\uD83D\uDCCB"}
            </span>
          </div>
          {copied && copyType === "body" && (
            <p className="text-green-600 font-semibold mt-2">
              \uBCF8\uBB38\uC774 \uBCF5\uC0AC\uB410\uC5B4\uC694!
            </p>
          )}
        </button>

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
            ? "\u2705 \uC804\uCCB4\uAC00 \uBCF5\uC0AC\uB410\uC5B4\uC694!"
            : "\uD83D\uDCCB \uC81C\uBAA9 + \uBCF8\uBB38 \uD55C\uBC88\uC5D0 \uBCF5\uC0AC\uD558\uAE30"}
        </button>
      </div>

      {/* \uBC1C\uD589 \uAC00\uC774\uB4DC */}
      <div className="px-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border-2 border-[var(--color-border)]">
          <h3 className="text-xl font-bold mb-4">
            {"\uD83D\uDCDD"} \uBE14\uB85C\uADF8\uC5D0 \uC62C\uB9AC\uB294 \uBC29\uBC95
          </h3>
          <div className="space-y-5">
            <GuideStep
              number={1}
              title="\uB124\uC774\uBC84 \uBE14\uB85C\uADF8 \uC5F4\uAE30"
              description="\uC544\uB798 \uBC84\uD2BC\uC744 \uB20C\uB7EC \uBE14\uB85C\uADF8\uB97C \uC5F4\uC5B4\uC8FC\uC138\uC694"
            />
            <GuideStep
              number={2}
              title={'"\uAE00\uC4F0\uAE30" \uBC84\uD2BC \uB204\uB974\uAE30'}
              description="\uBE14\uB85C\uADF8 \uD654\uBA74 \uC704\uCABD\uC5D0 \uC788\uB294 \uCD08\uB85D\uC0C9 \uAE00\uC4F0\uAE30 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694"
            />
            <GuideStep
              number={3}
              title="\uC81C\uBAA9 \uBD99\uC5EC\uB123\uAE30"
              description='\uC704\uC5D0\uC11C "\uC81C\uBAA9 \uBCF5\uC0AC\uD558\uAE30"\uB97C \uB204\uB978 \uB4A4, \uC81C\uBAA9 \uCE78\uC5D0 \uBD99\uC5EC\uB123\uAE30 \uD574\uC8FC\uC138\uC694'
            />
            <GuideStep
              number={4}
              title="\uBCF8\uBB38 \uBD99\uC5EC\uB123\uAE30"
              description='"\uBCF8\uBB38 \uBCF5\uC0AC\uD558\uAE30"\uB97C \uB204\uB978 \uB4A4, \uAE00 \uB0B4\uC6A9 \uCE78\uC5D0 \uBD99\uC5EC\uB123\uAE30 \uD574\uC8FC\uC138\uC694'
            />
            <GuideStep
              number={5}
              title={'"\uBC1C\uD589" \uBC84\uD2BC \uB204\uB974\uAE30'}
              description="\uC624\uB978\uCABD \uC704\uC758 \uBC1C\uD589 \uBC84\uD2BC\uC744 \uB204\uB974\uBA74 \uB05D\uC774\uC5D0\uC694!"
            />
          </div>
        </div>
      </div>

      {/* \uB124\uC774\uBC84 \uBE14\uB85C\uADF8 \uBC14\uB85C\uAC00\uAE30 */}
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
          {"\uD83D\uDFE2"} \uB124\uC774\uBC84 \uBE14\uB85C\uADF8 \uC5F4\uAE30
        </a>
      </div>

      {/* \uCC98\uC74C\uC73C\uB85C */}
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
          \uCC98\uC74C\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30
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
