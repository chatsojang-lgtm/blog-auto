import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  buildSearchPrompt,
  buildSystemPrompt,
  buildIntroPrompt,
  buildBody1Prompt,
  buildBody2Prompt,
  buildConclusionPrompt,
  buildTitlePrompt,
  type GenerateInput,
} from "@/lib/ai/prompt-chain";
import { runPostProcessing } from "@/lib/seo/post-processor";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/** Claude API 호출 헬퍼 (일반 텍스트 생성용) */
async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type === "text") {
    return block.text;
  }
  return "";
}

/** Claude 웹 검색을 이용한 매장 정보 수집 */
async function searchStoreInfo(
  storeName: string,
  storeAddress: string,
  theme: string
): Promise<string> {
  const searchPrompt = buildSearchPrompt({ storeName, storeAddress, theme });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    tools: [
      {
        type: "web_search_20250305" as const,
        name: "web_search" as const,
        max_uses: 10,
      },
    ],
    messages: [{ role: "user", content: searchPrompt }],
  });

  // 응답에서 텍스트 블록만 추출
  const textBlocks = message.content.filter(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );

  return textBlocks.map((b) => b.text).join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const storeName = body.storeName || "";
    const storeAddress = body.storeAddress || "";
    const theme = body.theme || "";
    const keywords = body.keywords || "";

    if (!storeName || !storeAddress || !theme) {
      return NextResponse.json(
        { error: "매장 이름, 주소, 테마를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // === 1단계: 온라인 검색으로 실제 매장 정보 수집 ===
    console.log(`[검색 시작] ${storeName} - ${storeAddress}`);
    const searchResults = await searchStoreInfo(storeName, storeAddress, theme);
    console.log(`[검색 완료] 결과 길이: ${searchResults.length}자`);
    console.log(`[검색 결과 앞 200자] ${searchResults.substring(0, 200)}`);
    console.log(`[STORE_NOT_FOUND 포함여부] ${searchResults.includes("[STORE_NOT_FOUND]")}`);

    // === 검색 결과 검증: 매장 정보를 찾지 못한 경우 에러 반환 ===
    if (
      searchResults.length < 80 ||
      searchResults.includes("[STORE_NOT_FOUND]")
    ) {
      return NextResponse.json(
        {
          error:
            "입력하신 매장 정보를 인터넷에서 찾지 못했어요. 매장 이름과 주소를 다시 확인해주세요.",
        },
        { status: 404 }
      );
    }
    // [STORE_FOUND] 마커 제거 후 본문만 전달
    const cleanedSearchResults = searchResults.replace("[STORE_FOUND]", "").trim();

    const input: GenerateInput = {
      storeName,
      storeAddress,
      theme,
      searchResults: cleanedSearchResults,
      keywords,
    };

    // === 2단계: 검색 결과 기반 블로그 글 생성 ===
    const systemPrompt = buildSystemPrompt(input);

    // Step A: 제목 + 서론 동시 생성
    const [titleResult, introResult] = await Promise.all([
      callClaude(systemPrompt, buildTitlePrompt(input)),
      callClaude(systemPrompt, buildIntroPrompt(input)),
    ]);

    // Step B: 본론1 생성 (서론 참조)
    const body1Result = await callClaude(
      systemPrompt,
      buildBody1Prompt(input, introResult)
    );

    // Step C: 본론2 생성
    const body2Result = await callClaude(
      systemPrompt,
      buildBody2Prompt(input, introResult + body1Result)
    );

    // Step D: 결론/FAQ 생성 (이전 내용 전달하여 중복 방지)
    const prevAllHtml = [introResult, body1Result, body2Result].join("\n\n");
    const conclusionResult = await callClaude(
      systemPrompt,
      buildConclusionPrompt(input, prevAllHtml)
    );

    // 전체 병합
    const fullHtml = [introResult, body1Result, body2Result, conclusionResult].join(
      "\n\n"
    );

    // SEO 후처리 파이프라인 실행
    const keyword = storeName;
    const { processedHtml, stats } = runPostProcessing(fullHtml, keyword);

    // 제목 정리
    const cleanTitle = titleResult
      .replace(/["""'']/g, "")
      .replace(/\n/g, "")
      .trim();

    return NextResponse.json({
      title: cleanTitle,
      html: processedHtml,
      stats,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("글 생성 오류 상세:", errMsg);
    return NextResponse.json(
      { error: `글 생성 중 문제가 발생했어요: ${errMsg}` },
      { status: 500 }
    );
  }
}
