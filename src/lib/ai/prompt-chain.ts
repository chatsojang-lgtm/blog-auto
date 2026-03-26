/**
 * 4단계 프롬프트 체이닝 파이프라인
 * PDF 보고서 기반: 서론 → 본론1 → 본론2 → 결론FAQ 순차 생성
 */

export interface GenerateInput {
  storeName: string;
  category: string;
  topic: string;
  keyword: string;
  extraInfo: string;
}

/** 시스템 프롬프트 - 페르소나 + 톤 제어 (PDF 4.2절 적용) */
function buildSystemPrompt(input: GenerateInput): string {
  const roleMap: Record<string, string> = {
    "맛집/음식점": "15년 경력의 외식업 전문 사장님",
    "미용실/헤어샵": "15년 경력의 헤어 디자이너 원장님",
    "헬스장/PT": "10년 경력의 피트니스 전문 트레이너",
    "피부관리/뷰티": "15년 경력의 피부미용 전문 원장님",
    "카페/디저트": "10년 경력의 카페 운영 전문 사장님",
    "기타 매장": "10년 경력의 매장 운영 전문가",
  };

  const role = roleMap[input.category] || roleMap["기타 매장"];

  return `너는 '${input.storeName}'의 ${role}이다.

[절대 규칙]
1. 너는 지금 정보 전달용 딱딱한 설명문을 쓰는 것이 아니다. 당신의 오프라인 매장을 방문한 5년 차 단골손님과 안내 데스크에 마주 앉아 따뜻한 커피를 마시며 대화하듯, 매우 편안하고 친절한 한국어 구어체(해요체 위주, 간혹 하십시오체 혼용)로 작성하라.
2. 다음 단어/표현은 절대 출력 금지: "결론적으로", "종합하자면", "요약하자면", "살펴보았습니다", "알아보았습니다", "~에 대해 알아보겠습니다", "~는 어떨까요?", "~에 있어 중요한 역할을 합니다", "오늘의 포스팅이 도움이 되셨길 바랍니다", "이상으로"
3. 접속사(하지만, 그러나, 그리고, 따라서, 그런데)는 전체 문장의 5% 미만으로 억제하라. 문맥의 흐름만으로 자연스럽게 이어지도록 쓰라.
4. 동일한 종결어미(~습니다, ~어요, ~합니다)가 3회 이상 연속 등장하지 않도록 하라. "~했는데요,", "~더라고요!", "~죠.", "~거든요." 등 다양한 변주를 섞어라.
5. 문장 중 10%는 신체적 감각이나 감정 변화를 구체적으로 묘사하라. (예: "오늘 3시간 동안 서서 작업하느라 손목이 시큰거렸지만, 거울 보고 활짝 웃으시는 고객님 표정에 피로가 싹 가시더라고요")
6. 가끔은 "음, 사실은요", "아차, 이 부분을 빼먹을 뻔했네요" 같은 인간적인 추임새를 전체 텍스트의 10% 비율로 의도적으로 섞어라.
7. 구체적인 숫자(대기시간, 가격, 거리 등)와 고유명사(메뉴명, 직원 직급 등)를 본문 내에 최소 3회 이상 자연스럽게 분산 삽입하라.

[HTML 형식 규칙]
- 소제목은 반드시 <h2>, <h3> 태그를 사용하라.
- 문단은 최대 2~3문장 단위로 <p> 태그로 나누어라.
- 핵심 단어 1~2개에만 <strong> 태그를 적용하라. 남발 금지.
- 이모지는 소제목 앞에만 1개씩 제한 사용.`;
}

/** 1단계: 서론 생성 (후킹 + 개념 정의) - PDF 4.1절 1번 */
function buildIntroPrompt(input: GenerateInput): string {
  const kw = input.keyword || `${input.storeName} ${input.category}`;
  return `[서론 작성 지시]
- 가게: ${input.storeName} (${input.category})
- 글 주제: ${input.topic}
- 핵심 검색어: ${kw}
- 추가정보: ${input.extraInfo || "없음"}

다음 규칙을 지켜서 서론(도입부)을 HTML로 작성하라:
1. 첫 문장은 방문자의 페인포인트를 정확히 찌르는 공감형 질문으로 시작하라. (예: "매번 뿌리 염색 맞추기 힘드셔서 스트레스받은 경험 있으신가요?")
2. 첫 100자 이내에 핵심 검색어 "${kw}"를 반드시 자연스럽게 1회 포함하라. 이것은 절대 규칙이다.
3. 질문 직후, 이 포스팅이 다룰 핵심 정보를 한두 문장으로 간결하게 선언하라.
4. <h2> 태그로 서론 소제목을 만들고, 소제목에 핵심 검색어 또는 연관어를 포함하라.
5. 분량: 150~250자 내외.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 2단계: 본론1 생성 (스토리텔링) - PDF 4.1절 2번 */
function buildBody1Prompt(input: GenerateInput, introHtml: string): string {
  const kw = input.keyword || `${input.storeName} ${input.category}`;
  return `[본론1 작성 지시]
- 가게: ${input.storeName} (${input.category})
- 글 주제: ${input.topic}
- 핵심 검색어: ${kw}
- 추가정보: ${input.extraInfo || "없음"}

앞서 작성된 서론:
${introHtml}

이어서 본론1을 HTML로 작성하라:
1. 업장만의 특별한 노하우나 실제 서비스 사례를 바탕으로 스토리텔링을 전개하라.
2. '좁고 구체적인 하위 주제'를 깊이 있게 파고들어라. 잡다한 주변 주제를 섞지 마라.
3. 1인칭 시점의 미시적 서사(Micro-narrative)를 포함하라. "삼겹살이 맛있었습니다"가 아니라 "사장님이 직접 온도계로 불판 온도를 200도까지 체크한 뒤 고기를 올려주셨는데, 첫 입을 먹었을 때 비계의 바삭함과 육즙이 터지는 식감이 놀라웠어요" 수준의 감각적 묘사.
4. <h3> 소제목을 2개 이상 사용하고, 각 소제목에 롱테일 키워드(예: "주말 예약 방법", "인근 주차장 요금")를 매핑하라.
5. 이미지가 들어갈 위치를 <!-- IMAGE --> 주석으로 2~3곳 표시하라.
6. 분량: 400~600자 내외.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 3단계: 본론2 생성 (신뢰도 증명) - PDF 4.1절 3번 */
function buildBody2Prompt(input: GenerateInput, prevHtml: string): string {
  const kw = input.keyword || `${input.storeName} ${input.category}`;
  return `[본론2 작성 지시]
- 가게: ${input.storeName} (${input.category})
- 글 주제: ${input.topic}
- 핵심 검색어: ${kw}

앞서 작성된 내용 요약: (서론 + 본론1 이미 작성됨)

이어서 본론2를 HTML로 작성하라:
1. 텍스트로만 주장하던 내용에 객관적인 힘을 실어주는 단계다.
2. 구체적인 가격, 위치(역에서 도보 몇 분), 영업시간, 주차 정보 등 실질적 데이터를 포함하라.
3. 고객 후기나 방문 경험을 생생하게 인용하는 형태로 서술하라.
4. <h3> 소제목 1~2개를 사용하라.
5. <!-- IMAGE --> 주석으로 이미지 위치 1~2곳 표시하라.
6. 분량: 300~500자 내외.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 4단계: 결론 + FAQ 생성 - PDF 4.1절 4번 */
function buildConclusionPrompt(input: GenerateInput): string {
  const kw = input.keyword || `${input.storeName} ${input.category}`;
  return `[결론 및 FAQ 작성 지시]
- 가게: ${input.storeName} (${input.category})
- 핵심 검색어: ${kw}

결론부를 HTML로 작성하라:
1. <h2> 태그로 결론 소제목을 만들라.
2. 포스팅을 읽은 사용자가 가질 법한 질문 3~4가지를 <ul><li> 리스트로 정리하라. (예: "예약은 어떻게 하나요?", "주차는 몇 시간 무료인가요?") 각 질문에 간단한 답변도 포함.
3. 마지막에 방문을 유도하는 따뜻한 콜투액션(CTA) 문구를 넣어라. (예: "언제든 편하게 들러주세요!")
4. 네이버 지도 검색을 유도하는 안내 문구를 자연스럽게 포함하라. (예: "네이버 지도에서 '${input.storeName}' 검색하시면 바로 찾으실 수 있어요")
5. 분량: 200~350자 내외.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 제목 생성 - PDF 1.2절 적용 */
function buildTitlePrompt(input: GenerateInput): string {
  const kw = input.keyword || `${input.storeName}`;
  return `[블로그 제목 생성 지시]
- 가게: ${input.storeName} (${input.category})
- 글 주제: ${input.topic}
- 핵심 검색어: ${kw}

다음 규칙을 지켜서 블로그 제목을 1개만 생성하라:
1. 25자 이하로 작성.
2. 핵심 검색어를 문장의 가장 앞(좌측)에 배치.
3. "맛집 맛집추천 강남맛집"처럼 명사만 나열 금지. 자연스러운 문장 형태.
4. 핵심 키워드는 1~2회만 포함.
5. 클릭하고 싶게 만드는 호기심 유발 요소 포함.

제목 텍스트만 출력하라. 따옴표나 설명 없이 제목만.`;
}

export {
  buildSystemPrompt,
  buildIntroPrompt,
  buildBody1Prompt,
  buildBody2Prompt,
  buildConclusionPrompt,
  buildTitlePrompt,
};
