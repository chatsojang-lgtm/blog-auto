import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
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

/** Claude API 호출 헬퍼 */
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: GenerateInput = {
      storeName: body.storeName || "",
      category: body.category || "",
      topic: body.topic || "",
      keyword: body.keyword || "",
      extraInfo: body.extraInfo || "",
    };

    if (!input.storeName || !input.category || !input.topic) {
      return NextResponse.json(
        { error: "가게 이름, 종류, 주제를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(input);

    // === 4단계 프롬프트 체이닝 (PDF 4절 적용) ===

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

    // Step D: 결론/FAQ 생성
    const conclusionResult = await callClaude(
      systemPrompt,
      buildConclusionPrompt(input)
    );

    // 전체 병합
    const fullHtml = [introResult, body1Result, body2Result, conclusionResult].join(
      "\n\n"
    );

    // SEO 후처리 파이프라인 실행
    const keyword = input.keyword || input.storeName;
    const { processedHtml, stats } = runPostProcessing(fullHtml, keyword);

    // 제목 정리 (따옴표, 줄바꿈 제거)
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
    console.error("API KEY 앞 20자:", process.env.ANTHROPIC_API_KEY?.substring(0, 20));
    return NextResponse.json(
      { error: `글 생성 중 문제가 발생했어요: ${errMsg}` },
      { status: 500 }
    );
  }
}
