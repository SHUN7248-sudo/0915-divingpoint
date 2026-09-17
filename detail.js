/* detail.js — 상세 화면(detail.html) 동작
 * 주소창의 ?spot=팔라우id&tier=가격대id 두 값만 읽어서 화면을 그린다.
 * 가격대를 다시 고르는 토글은 여기에 없다. 메인에서 고른 값을 그대로 쓴다.
 */

(function () {
  var params = new URLSearchParams(window.location.search);
  var spotId = params.get("spot");
  var tierId = params.get("tier");

  var spot = findSpot(spotId);
  var tier = findTier(tierId);

  /* 스팟 값이 잘못되었으면 보여줄 내용이 없으므로 메인으로 되돌린다. */
  if (!spot) {
    window.location.replace("index.html");
    return;
  }

  var backLink = document.getElementById("backLink");
  var tierWarning = document.getElementById("tierWarning");
  var headerTitle = document.getElementById("headerTitle");
  var detailTitle = document.getElementById("detailTitle");
  var priceRows = document.getElementById("priceRows");
  var freeGrid = document.getElementById("freeGrid");

  /* 뒤로가기는 고른 가격대를 그대로 달고 메인으로 돌아간다. */
  backLink.href = tier ? "index.html?tier=" + tier.id : "index.html";

  headerTitle.textContent = spot.name + " 일정별 예상 금액";
  detailTitle.textContent = tier
    ? spot.name + " · " + tier.label + " 기준"
    : spot.name;

  /* 1. 일정 5종 금액 표 — 5줄을 항상 모두 만든다. */
  for (var i = 0; i < PLANS.length; i++) {
    var plan = PLANS[i];
    var price = tier ? calcPrice(spot.id, plan.id, tier.id) : null;

    var row = document.createElement("tr");
    var head = document.createElement("th");
    head.setAttribute("scope", "row");
    head.textContent = plan.label;

    var cell = document.createElement("td");
    if (price === null) {
      /* 금액을 만들 수 없을 때만 쓰는 문구 */
      cell.className = "is-missing";
      cell.textContent = MESSAGES.missingData;
    } else {
      cell.textContent = formatWon(price);
    }

    row.appendChild(head);
    row.appendChild(cell);
    priceRows.appendChild(row);
  }

  /* 가격대가 없을 때만 보이는 안내 */
  if (!tier) {
    tierWarning.textContent = MESSAGES.noTier;
    tierWarning.classList.remove("is-hidden");
  }

  /* 2. 주요 다이빙 포인트 카드
   *
   * 사진 처리가 이 부분의 핵심이다.
   * assets 폴더에 사진이 아직 없어도 화면이 깨지면 안 되므로,
   * 이미지 로딩에 실패하면(error 이벤트) 사진을 지우고 "무슨 파일을 넣어야 하는지" 안내를 대신 보여준다.
   */
  var pointGrid = document.getElementById("pointGrid");
  var points = spot.divePoints || [];

  for (var p = 0; p < points.length; p++) {
    pointGrid.appendChild(createPointCard(points[p]));
  }

  function createPointCard(point) {
    var li = document.createElement("li");
    li.className = "point-card";

    /* 사진 자리 */
    var photoBox = document.createElement("div");
    photoBox.className = "point-card__photo";

    var hint = document.createElement("p");
    hint.className = "point-card__hint";
    hint.textContent = MESSAGES.photoMissing + " (" + point.photo + ")";
    photoBox.appendChild(hint);

    var img = document.createElement("img");
    img.alt = point.name + " 다이빙 포인트 사진";
    img.loading = "lazy";
    /* 파일이 없으면 error 가 나므로, 그때 사진을 치우고 안내를 드러낸다. */
    img.addEventListener("error", function () {
      photoBox.classList.add("is-empty");
      if (img.parentNode) img.parentNode.removeChild(img);
    });
    img.src = point.photo;
    photoBox.appendChild(img);

    /* 글 영역 */
    var body = document.createElement("div");
    body.className = "point-card__body";

    var title = document.createElement("h4");
    title.className = "point-card__title";
    title.textContent = point.name;
    body.appendChild(title);

    var en = document.createElement("p");
    en.className = "point-card__en";
    en.textContent = point.en;
    body.appendChild(en);

    /* 칩(작은 라벨) — 수심은 출처에 값이 있을 때만 만든다. */
    var chips = document.createElement("p");
    chips.className = "chip-row";
    if (point.depth) chips.appendChild(createChip("수심 " + point.depth));
    if (point.current && point.current !== "정보 없음") {
      chips.appendChild(createChip("조류 " + point.current));
    }
    chips.appendChild(createChip(point.level));
    body.appendChild(chips);

    var desc = document.createElement("p");
    desc.className = "point-card__desc";
    desc.textContent = point.desc;
    body.appendChild(desc);

    li.appendChild(photoBox);
    li.appendChild(body);
    return li;
  }

  function createChip(text) {
    var chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = text;
    return chip;
  }

  /* 3. 자유일정 카드 2개 — 각 카드에 권장 타이밍 태그가 들어간다. */
  for (var j = 0; j < spot.freeTime.length; j++) {
    var item = spot.freeTime[j];

    var li = document.createElement("li");
    li.className = "free-card";
    li.innerHTML =
      '<h4 class="free-card__title">' + item.title + "</h4>" +
      '<p class="free-card__desc">' + item.desc + "</p>" +
      '<span class="free-card__timing">' + item.timing + "</span>";

    freeGrid.appendChild(li);
  }
})();
