/**
 * 프롬프트 체이닝 파이프라인 (개선판)
 * 온라인 검색 결과 기반으로 실제 매장 정보를 활용한 블로그 글 생성
 */

export interface GenerateInput {
  storeName: string;
  storeAddress: string;
  theme: string;
  searchResults: string;
  keywords: string;
}

/** 웹 검색용 프롬프트 */
function buildSearchPrompt(input: { storeName: string; storeAddress: string; theme: string }): string {
  return `다음 매장에 대한 정보를 최대한 상세하게 조사해주세요.

매장명: ${input.storeName}
매장 주소: ${input.storeAddress}

반드시 "${input.storeName}" + "${input.storeAddress}" 조합으로 검색하여 정확히 해당 매장의 정보만 수집해주세요.
동일 이름의 다른 지역 매장 정보를 혼동하지 마세요.

다음 항목들을 중심으로 조사해주세요:
1. 매장 업종/카테고리
2. 대표 메뉴/서비스 및 가격
3. 영업시간
4. 고객 리뷰 및 평점 (실제 리뷰 내용 포함)
5. 매장 특징, 분위기, 인테리어
6. 주차 정보
7. 근처 랜드마크/교통편 (지하철역 도보 거리 등)
8. SNS/블로그에서 자주 언급되는 키워드
9. 이벤트나 프로모션 정보 (있는 경우)

조사한 정보를 항목별로 정리해서 알려주세요. 확인되지 않은 항목은 생략해주세요.
절대로 정보를 지어내지 마세요. 검색으로 확인된 사실만 기록하세요.

중요: 응답의 첫 줄에 반드시 다음 중 하나를 작성하세요:
- 매장을 찾은 경우: "[STORE_FOUND]"
- 매장을 찾지 못한 경우: "[STORE_NOT_FOUND]"`;
}

/** 시스템 프롬프트 - 검색 결과 기반 */
function buildSystemPrompt(input: GenerateInput): string {
  return `너는 '${input.storeName}'(${input.storeAddress}) 매장의 블로그 글 작성 전문가이다.

[핵심 원칙: 실제 정보만 사용]
- 아래 제공되는 "온라인 검색 결과"에 있는 정보만 사용하여 글을 작성하라.
- 검색 결과에 없는 메뉴명, 가격, 영업시간, 서비스 등을 절대 지어내지 마라.
- 검색 결과에서 확인되지 않은 항목은 언급하지 마라.
- "확인 불가"로 표기된 항목은 글에 포함하지 마라.

[온라인 검색 결과]
${input.searchResults}

[절대 금지 사항]
- "확인되지 않았다", "정보를 찾기 어려웠다", "확인이 되지 않더라고요", "명확하게 나오지 않더라고요", "아쉽게도 확인할 수 없었어요" 등 정보가 없다는 내용을 절대 작성하지 마라.
- 정보가 부족한 항목은 아예 언급하지 말고 건너뛰어라. "없다"는 사실 자체를 글에 쓰지 마라.
- "매장명이 변경되었을 수도 있으니", "전화로 확인해보시는 게 좋겠어요" 같은 불확실성 표현 금지.

[중복 방지 규칙]
- 이미 앞 섹션에서 언급한 정보(메뉴명, 가격, 주소, 특징 등)를 다른 섹션에서 반복하지 마라.
- 각 섹션은 서로 다른 정보를 다뤄야 한다. 동일한 사실을 다른 표현으로 재작성하는 것도 금지.
- 결론/FAQ에서 본문 내용을 요약 정리하는 형태로 반복하지 마라.

[글쓰기 규칙]
1. 매우 편안하고 친절한 한국어 구어체(해요체 위주, 간혹 하십시오체 혼용)로 작성하라.
2. 다음 단어/표현은 절대 출력 금지: "결론적으로", "종합하자면", "요약하자면", "살펴보았습니다", "알아보았습니다", "~에 대해 알아보겠습니다", "~는 어떨까요?", "오늘의 포스팅이 도움이 되셨길 바랍니다", "이상으로"
3. 접속사(하지만, 그러나, 그리고, 따라서, 그런데)는 전체 문장의 5% 미만으로 억제하라.
4. 동일한 종결어미(~습니다, ~어요, ~합니다)가 3회 이상 연속 등장하지 않도록 하라. "~했는데요,", "~더라고요!", "~죠.", "~거든요." 등 다양한 변주를 섞어라.
5. 문장 중 10%는 신체적 감각이나 감정 변화를 구체적으로 묘사하라.
6. 가끔은 "음, 사실은요", "아차, 이 부분을 빼먹을 뻔했네요" 같은 인간적인 추임새를 섞어라.
7. 검색 결과에서 확인된 구체적인 숫자(가격, 거리 등)와 고유명사(메뉴명 등)를 자연스럽게 분산 삽입하라.

[HTML 형식 규칙]
- 소제목은 반드시 <h2>, <h3> 태그를 사용하라.
- 문단은 최대 2~3문장 단위로 <p> 태그로 나누어라.
- 핵심 단어 1~2개에만 <strong> 태그를 적용하라. 남발 금지.
- 이모지는 소제목 앞에만 1개씩 제한 사용.${input.keywords ? `\n\n[사용자 지정 키워드]\n다음 키워드를 글 내용에 자연스럽게 포함하라: ${input.keywords}` : ""}`;
}

/** 1단계: 서론 생성 */
function buildIntroPrompt(input: GenerateInput): string {
  return `[서론 작성 지시]
- 매장: ${input.storeName} (${input.storeAddress})
- 블로그 테마: ${input.theme}
- 핵심 검색어: ${input.storeName}

다음 규칙을 지켜서 서론(도입부)을 HTML로 작성하라:
1. 첫 문장은 방문자의 페인포인트를 정확히 찌르는 공감형 질문으로 시작하라.
2. 첫 100자 이내에 "${input.storeName}"을 반드시 자연스럽게 1회 포함하라.
3. 이 포스팅이 다룰 핵심 정보를 한두 문장으로 간결하게 선언하라.
4. <h2> 태그로 서론 소제목을 만들고, 소제목에 매장명 또는 연관어를 포함하라.
5. 분량: 150~250자 내외.
6. "${input.theme}" 테마에 맞는 톤과 방향으로 작성하라.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 2단계: 본론1 생성 (스토리텔링) */
function buildBody1Prompt(input: GenerateInput, introHtml: string): string {
  return `[본론1 작성 지시]
- 매장: ${input.storeName} (${input.storeAddress})
- 블로그 테마: ${input.theme}
- 핵심 검색어: ${input.storeName}

앞서 작성된 서론:
${introHtml}

이어서 본론1을 HTML로 작성하라:
1. 검색 결과에서 확인된 매장의 실제 메뉴/서비스/특징을 중심으로 스토리텔링을 전개하라.
2. 검색 결과에 있는 실제 정보(메뉴명, 가격, 서비스)만 사용하라. 없는 정보를 지어내지 마라.
3. 1인칭 방문자 시점의 감각적 묘사를 포함하되, 검색 결과 범위 내에서만 작성하라.
4. <h3> 소제목을 2개 이상 사용하고, 각 소제목에 롱테일 키워드를 매핑하라.
5. 이미지가 들어갈 위치를 <!-- IMAGE --> 주석으로 2~3곳 표시하라.
6. 분량: 400~600자 내외.
7. "${input.theme}" 테마에 맞게 내용을 구성하라.
8. 서론에서 이미 언급한 정보는 반복하지 마라. 새로운 정보만 다뤄라.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 3단계: 본론2 생성 (신뢰도 증명) */
function buildBody2Prompt(input: GenerateInput, prevHtml: string): string {
  return `[본론2 작성 지시]
- 매장: ${input.storeName} (${input.storeAddress})
- 블로그 테마: ${input.theme}
- 핵심 검색어: ${input.storeName}

[이미 작성된 내용 - 아래 내용과 중복되는 정보는 절대 다시 쓰지 마라]
${prevHtml}

이어서 본론2를 HTML로 작성하라:
1. 검색 결과에서 확인된 객관적 데이터 중 위에서 아직 언급되지 않은 정보만 활용하라: 영업시간, 주차 정보, 위치 상세, 리뷰 등.
2. 검색 결과에 있는 실제 고객 리뷰나 평점을 인용하여 신뢰도를 높여라. 리뷰 정보가 없으면 이 항목은 생략하라.
3. 위에서 이미 언급한 메뉴명, 가격, 특징은 반복하지 마라.
4. <h3> 소제목 1~2개를 사용하라.
5. <!-- IMAGE --> 주석으로 이미지 위치 1~2곳 표시하라.
6. 분량: 300~500자 내외.
7. "${input.theme}" 테마와 연관된 실용 정보를 강조하라.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 4단계: 결론 + FAQ 생성 */
function buildConclusionPrompt(input: GenerateInput, prevHtml: string): string {
  return `[결론 및 FAQ 작성 지시]
- 매장: ${input.storeName} (${input.storeAddress})
- 핵심 검색어: ${input.storeName}

[이미 작성된 내용 - 아래 내용을 요약하거나 반복하지 마라]
${prevHtml}

결론부를 HTML로 작성하라:
1. <h2> 태그로 결론 소제목을 만들라.
2. 위 본문에서 다루지 않은 새로운 관점의 FAQ 2~3가지를 <ul><li> 리스트로 정리하라. 이미 본문에 나온 정보를 질문-답변 형식으로 반복하지 마라.
3. 마지막에 방문을 유도하는 따뜻한 콜투액션(CTA) 문구를 넣어라.
4. 네이버 지도 검색을 유도하는 안내 문구를 자연스럽게 포함하라. (예: "네이버 지도에서 '${input.storeName}' 검색하시면 바로 찾으실 수 있어요")
5. 분량: 150~250자 내외.

HTML만 출력하라. 다른 설명 없이.`;
}

/** 제목 생성 */
function buildTitlePrompt(input: GenerateInput): string {
  return `[블로그 제목 생성 지시]
- 매장: ${input.storeName} (${input.storeAddress})
- 블로그 테마: ${input.theme}
- 핵심 검색어: ${input.storeName}

다음 규칙을 지켜서 블로그 제목을 1개만 생성하라:
1. 25자 이하로 작성.
2. 매장명 "${input.storeName}"을 제목 앞쪽에 배치.
3. "맛집 맛집추천 강남맛집"처럼 명사만 나열 금지. 자연스러운 문장 형태.
4. 핵심 키워드는 1~2회만 포함.
5. "${input.theme}" 테마가 드러나도록 작성.
6. 클릭하고 싶게 만드는 호기심 유발 요소 포함.${input.keywords ? `\n7. 가능하면 다음 키워드 중 하나를 제목에 반영하라: ${input.keywords}` : ""}

제목 텍스트만 출력하라. 따옴표나 설명 없이 제목만.`;
}

export {
  buildSearchPrompt,
  buildSystemPrompt,
  buildIntroPrompt,
  buildBody1Prompt,
  buildBody2Prompt,
  buildConclusionPrompt,
  buildTitlePrompt,
};
