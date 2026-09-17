/* data.js
 * 화면에 쓰이는 모든 예시 데이터와 금액 계산 규칙을 한곳에 모아 둔 파일.
 * index.html / detail.html 양쪽에서 <script src="data.js"> 로 먼저 불러온다.
 *
 * 다이빙 포인트 정보 출처: liveaboard.com (2026-09 확인)
 *   - https://www.liveaboard.com/diving/micronesia/palau
 *   - https://www.liveaboard.com/diving/thailand/similan-islands
 *   - https://www.liveaboard.com/diving/maldives
 * 출처에 수심이 적혀 있던 포인트만 depth 값을 넣었다. 없으면 null 로 두고 화면에 표시하지 않는다.
 * 지어낸 숫자를 넣지 않기 위한 규칙이다.
 */

/* 1. 고정 문구 — 명세에 정해진 문구만 사용한다. */
var MESSAGES = {
  missingData:
    "이 일정의 예시 금액이 아직 준비되지 않았습니다. 다른 일정을 선택하시거나, 카드의 총비용 범위를 참고해 주세요.",
  noTier:
    "표시할 가격대가 선택되지 않았습니다. 저가·중가·고가 중 하나를 선택하면 세 스팟의 금액이 함께 표시됩니다.",
  disclaimer:
    "이 금액은 실제 견적이 아니라 화면 확인용 예시 숫자입니다. 실제 비용은 현지 다이빙샵·항공사 확인이 필요합니다.",
  photoMissing: "사진 파일을 아직 넣지 않았습니다."
};

/* 2. 가격대 배율 */
var TIERS = [
  { id: "low", label: "저가", rate: 0.65 },
  { id: "mid", label: "중가", rate: 1.0 },
  { id: "high", label: "고가", rate: 1.9 }
];

var DEFAULT_TIER = "mid"; /* 첫 진입 기본값 */

/* 3. 일정 배율 (4박5일 = 1.0 기준) */
var PLANS = [
  { id: "daytrip", label: "데이트립", rate: 0.12 },
  { id: "n1d2", label: "1박2일", rate: 0.3 },
  { id: "n2d3", label: "2박3일", rate: 0.5 },
  { id: "n3d4", label: "3박4일", rate: 0.75 },
  { id: "n4d5", label: "4박5일", rate: 1.0 }
];

/* 4. 스팟별 기준금액(4박5일·중가·1인·원화, 항공+다이빙+숙박 포함) + 다이빙 포인트 + 자유일정
 *
 * divePoints 의 photo 는 assets 폴더 안 파일을 가리킨다.
 * 파일이 아직 없어도 화면은 깨지지 않는다 — 사진 자리에 "무엇을 넣어야 하는지" 안내가 대신 나온다.
 * 사진을 구해서 assets 폴더에 같은 이름으로 넣기만 하면 그 자리부터 사진으로 바뀐다.
 */
var SPOTS = [
  {
    id: "palau",
    name: "팔라우",
    base: 3500000,

    divePoints: [
      {
        name: "블루코너",
        en: "Blue Corner",
        depth: null,
        current: "강함",
        level: "고급",
        desc: "팔라우에서 가장 이름난 포인트. 리프 모서리에 훅을 걸고 버티면 상어와 대형 어류 무리가 조류를 타고 지나간다.",
        photo: "assets/palau-blue-corner.jpg"
      },
      {
        name: "저먼채널",
        en: "German Channel",
        depth: null,
        current: "강함",
        level: "중급",
        desc: "독일이 인산염 운반용으로 뚫은 수로 입구. 날개폭 3m까지 자라는 만타레이가 청소를 받으러 모인다.",
        photo: "assets/palau-german-channel.jpg"
      },
      {
        name: "이로마루 난파선",
        en: "Iro Maru Wreck",
        depth: "23~35m",
        current: "정보 없음",
        level: "고급",
        desc: "2차 세계대전 침몰선. 산호로 뒤덮인 함포가 그대로 남아 독자적인 생태계를 이루고 있다.",
        photo: "assets/palau-iro-maru.jpg"
      },
      {
        name: "샹들리에 케이브",
        en: "Chandelier Caves",
        depth: null,
        current: "정보 없음",
        level: "고급",
        desc: "다섯 개로 나뉜 동굴에 종유석과 석순이 자란다. 동굴 다이빙 경험과 손전등이 반드시 필요하다.",
        photo: "assets/palau-chandelier-caves.jpg"
      }
    ],

    freeTime: [
      {
        title: "록아일랜드 카약 & 무인섬 피크닉",
        desc: "얕은 라군을 카약으로 건너 석회암 섬 사이 무인 해변에서 도시락을 먹는 반나절 코스.",
        timing: "권장 타이밍: 마지막 다이빙 다음 날 오전"
      },
      {
        title: "밀키웨이 화이트클레이 스파",
        desc: "바다 밑 흰 진흙을 몸에 바르고 라군 물에 헹구는 현지식 스파. 체력 소모가 거의 없다.",
        timing: "권장 타이밍: 마지막 다이빙 직후 오후"
      }
    ]
  },

  {
    id: "similan",
    name: "시밀란",
    base: 2000000,

    divePoints: [
      {
        name: "엘리펀트 헤드 락",
        en: "Elephant Head Rock",
        depth: null,
        current: "강함",
        level: "고급",
        desc: "시밀란에서 가장 큰 핀나클. 바위 사이로 뚫린 수중 통로를 지나며 화이트팁 리프상어와 배트피시를 만난다.",
        photo: "assets/similan-elephant-head-rock.jpg"
      },
      {
        name: "크리스마스 포인트",
        en: "Christmas Point",
        depth: null,
        current: "중간",
        level: "중급",
        desc: "9번 섬 서쪽 끝. 거대한 아치형 통로가 이어져 시밀란에서 가장 다채롭고 경치 좋은 다이브로 꼽힌다.",
        photo: "assets/similan-christmas-point.jpg"
      },
      {
        name: "볼더 시티",
        en: "Boulder City",
        depth: null,
        current: "중간~강함",
        level: "중상급",
        desc: "3번 섬에서 1km 떨어진 바다. 모래 바닥에 화강암 바위가 쌓여 있고, 조류가 맞으면 고래상어와 만타레이가 지나간다.",
        photo: "assets/similan-boulder-city.jpg"
      },
      {
        name: "아니타 리프",
        en: "Anita's Reef",
        depth: null,
        current: "약함",
        level: "초급 가능",
        desc: "4번 섬 동쪽. 조류가 약해 대부분의 다이버에게 맞는다. 새우고비와 블루핀 트레발리를 가까이서 본다.",
        photo: "assets/similan-anitas-reef.jpg"
      }
    ],

    freeTime: [
      {
        title: "카오락 해변 산책 & 로컬 시푸드 저녁",
        desc: "리브어보드에서 내린 뒤 숙소 근처 해변을 걷고 항구 식당에서 저녁을 먹는 짧은 일정.",
        timing: "권장 타이밍: 리브어보드 하선 당일 저녁"
      },
      {
        title: "쿠라부리 맹그로브 보트 투어",
        desc: "강어귀 맹그로브 숲을 작은 보트로 도는 두 시간짜리 투어. 물에 들어가지 않는다.",
        timing: "권장 타이밍: 마지막 다이빙 다음 날 오전"
      }
    ]
  },

  {
    id: "maldives",
    name: "몰디브",
    base: 5000000,

    divePoints: [
      {
        name: "마야 틸라",
        en: "Maaya Thila · 아리 환초",
        depth: null,
        current: "중간",
        level: "중급",
        desc: "아리 환초를 대표하는 수중 봉우리. 리프 생물이 빽빽하게 붙어 있어 야간 다이빙 명소로도 꼽힌다.",
        photo: "assets/maldives-maaya-thila.jpg"
      },
      {
        name: "하니파루 베이",
        en: "Hanifaru Bay · 바아 환초",
        depth: null,
        current: "중간",
        level: "스노클링 전용",
        desc: "8월~11월 만타레이와 고래상어가 떼로 모인다. 보호구역이라 스쿠버 장비로는 들어갈 수 없고 스노클링만 가능하다.",
        photo: "assets/maldives-hanifaru-bay.jpg"
      },
      {
        name: "동칼로 틸라",
        en: "Donkalo Thila · 아리 환초",
        depth: null,
        current: "중간~강함",
        level: "중급",
        desc: "만타레이가 청소를 받으러 오는 자리 중 하나. 바닥에 자리를 잡고 기다리는 방식으로 관찰한다.",
        photo: "assets/maldives-donkalo-thila.jpg"
      },
      {
        name: "마바루 칸두",
        en: "Maavaru Kandu · 바아 환초",
        depth: null,
        current: "중간",
        level: "중급",
        desc: "파스텔 색 연산호가 정원처럼 깔린 수로. 색감이 좋아 사진 찍기에 좋은 포인트로 알려져 있다.",
        photo: "assets/maldives-maavaru-kandu.jpg"
      }
    ],

    freeTime: [
      {
        title: "말레 로컬섬 반나절 산책",
        desc: "스피드보트로 건너가 현지 마을 시장과 모스크를 둘러보는 코스. 리조트 밖 분위기를 본다.",
        timing: "권장 타이밍: 귀국 항공편 전날 오후"
      },
      {
        title: "리조트 선셋 크루즈",
        desc: "해질 무렵 도우니 배를 타고 라군을 한 바퀴 도는 한 시간 반 코스. 돌고래를 만나기도 한다.",
        timing: "권장 타이밍: 마지막 다이빙 직후 저녁"
      }
    ]
  }
];

/* 5. 조회용 도우미 함수들 */

function findTier(tierId) {
  for (var i = 0; i < TIERS.length; i++) {
    if (TIERS[i].id === tierId) return TIERS[i];
  }
  return null;
}

function findSpot(spotId) {
  for (var i = 0; i < SPOTS.length; i++) {
    if (SPOTS[i].id === spotId) return SPOTS[i];
  }
  return null;
}

/* 6. 금액 계산
 * 금액 = 스팟 기준금액 × 일정 배율 × 가격대 배율
 * 값을 만들 수 없으면(스팟·일정·가격대 중 하나라도 없으면) null 을 돌려준다.
 */
function calcPrice(spotId, planId, tierId) {
  var spot = findSpot(spotId);
  var tier = findTier(tierId);
  var plan = null;
  for (var i = 0; i < PLANS.length; i++) {
    if (PLANS[i].id === planId) plan = PLANS[i];
  }
  if (!spot || !tier || !plan) return null;
  return spot.base * plan.rate * tier.rate;
}

/* 7. 한 스팟의 총비용 범위 = 일정 5종 계산값 중 최저값 ~ 최고값 */
function calcRange(spotId, tierId) {
  var values = [];
  for (var i = 0; i < PLANS.length; i++) {
    var v = calcPrice(spotId, PLANS[i].id, tierId);
    if (v !== null) values.push(v);
  }
  if (values.length === 0) return null;
  return { min: Math.min.apply(null, values), max: Math.max.apply(null, values) };
}

/* 8. 숫자를 "1,706,250원" 형태로 바꾼다. 반올림하지 않고 계산값 그대로 쓴다. */
function formatWon(value) {
  return value.toLocaleString("ko-KR") + "원";
}
