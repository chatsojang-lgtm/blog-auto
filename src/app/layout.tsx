import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "블로그 글 도우미",
  description: "우리 가게 블로그 글을 쉽고 빠르게 만들어 드려요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[var(--color-bg)]">
        <main className="mx-auto max-w-lg min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
