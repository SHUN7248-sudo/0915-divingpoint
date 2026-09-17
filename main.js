/* main.js — 메인 화면(index.html) 동작
 * 하는 일은 두 가지뿐이다.
 *  1) 가격대 하나를 상태로 들고 있다가
 *  2) 그 값으로 카드 3개를 한 번에 다시 그린다.
 */

(function () {
  var tierGroup = document.getElementById("tierGroup");
  var tierWarning = document.getElementById("tierWarning");
  var spotGrid = document.getElementById("spotGrid");

  /* 현재 선택된 가격대. null 이면 '선택 안 됨' 상태. */
  var currentTier = readTierFromUrl();

  /* 주소창의 ?tier=... 값을 읽는다.
   * - 값이 아예 없으면(첫 진입) 기본값 중가
   * - 값이 있는데 저가/중가/고가가 아니면 '선택 안 됨'으로 본다(예외 상황) */
  function readTierFromUrl() {
    var params = new URLSearchParams(window.location.search);
    if (!params.has("tier")) return DEFAULT_TIER;
    var value = params.get("tier");
    return findTier(value) ? value : null;
  }

  /* 주소창을 현재 상태에 맞춰 조용히 바꾼다(새로고침·뒤로가기 때 값이 유지되도록). */
  function syncUrl() {
    var query = currentTier ? "?tier=" + currentTier : "";
    window.history.replaceState(null, "", window.location.pathname + query);
  }

  /* 토글 버튼 3개의 선택 표시를 갱신한다. */
  function renderTierButtons() {
    var buttons = tierGroup.querySelectorAll(".tier-button");
    for (var i = 0; i < buttons.length; i++) {
      var isSelected = buttons[i].getAttribute("data-tier") === currentTier;
      buttons[i].setAttribute("aria-pressed", isSelected ? "true" : "false");
    }
  }

  /* 카드 3개를 통째로 다시 그린다.
   * 하나만 고치는 게 아니라 매번 전부 다시 그리므로 세 숫자가 항상 함께 바뀐다. */
  function renderCards() {
    spotGrid.innerHTML = "";

    if (!currentTier) {
      tierWarning.textContent = MESSAGES.noTier;
      tierWarning.classList.remove("is-hidden");
      return;
    }
    tierWarning.classList.add("is-hidden");

    var tier = findTier(currentTier);

    for (var i = 0; i < SPOTS.length; i++) {
      var spot = SPOTS[i];
      var range = calcRange(spot.id, currentTier);

      var item = document.createElement("li");
      var card = document.createElement("a");
      card.className = "spot-card";
      card.href = "detail.html?spot=" + spot.id + "&tier=" + currentTier;

      var amountHtml;
      if (range) {
        amountHtml =
          '<p class="spot-card__amount">' +
          formatWon(range.min) + " ~ " + formatWon(range.max) +
          "</p>";
      } else {
        amountHtml = '<p class="warn-box">' + MESSAGES.missingData + "</p>";
      }

      card.innerHTML =
        '<h2 class="spot-card__name">' + spot.name + "</h2>" +
        '<p class="spot-card__amount-label">총비용 범위 · ' + tier.label + "</p>" +
        amountHtml +
        '<p class="spot-card__meta">1인 기준 · 예시 데이터 (데이트립 ~ 4박5일)</p>' +
        '<p class="spot-card__more">일정별 금액과 자유일정 보기 →</p>';

      item.appendChild(card);
      spotGrid.appendChild(item);
    }
  }

  /* 화면 전체를 현재 상태에 맞춰 다시 그린다. */
  function render() {
    renderTierButtons();
    renderCards();
    syncUrl();
  }

  /* 가격대 버튼 클릭 처리 */
  tierGroup.addEventListener("click", function (event) {
    var button = event.target.closest(".tier-button");
    if (!button) return;
    currentTier = button.getAttribute("data-tier");
    render();
  });

  /* 첫 진입: 클릭 없이 바로 그린다(기본값 중가). */
  render();
})();
