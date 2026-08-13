(function () {
  "use strict";

  const storageKey = "qmah-admin-theme";
  const root = document.documentElement;
  const body = document.body;

  function readToken(name, fallback) {
    const value = getComputedStyle(body).getPropertyValue(name).trim();
    return value || fallback;
  }

  function isDark() {
    return root.getAttribute("data-bs-theme") === "dark" || body.classList.contains("theme-dark");
  }

  function applyTheme(theme) {
    const dark = theme === "dark";
    root.setAttribute("data-bs-theme", dark ? "dark" : "light");
    body.classList.toggle("theme-dark", dark);
    try {
      localStorage.setItem(storageKey, dark ? "dark" : "light");
    } catch (error) {
      // Static demo can run with storage disabled; the control still works.
    }
    document.querySelectorAll("[data-qmah-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "切換為淺色模式" : "切換為深色模式");
      const label = button.querySelector("[data-qmah-theme-label]");
      if (label) label.textContent = dark ? "淺色" : "深色";
    });
    window.requestAnimationFrame(renderCharts);
  }

  function restoreTheme() {
    let saved = "light";
    try {
      saved = localStorage.getItem(storageKey) || "light";
    } catch (error) {
      saved = "light";
    }
    applyTheme(saved);
  }

  function chartOptions() {
    const text = readToken("--qmah-ink-soft", "#4e625e");
    const line = readToken("--qmah-line-soft", "#e8eeeb");
    const cobalt = readToken("--qmah-cobalt", "#3f6f86");
    const cinnabar = readToken("--qmah-cinnabar", "#a94434");
    const bronze = readToken("--qmah-bronze", "#8b7653");
    const surface = readToken("--qmah-surface", "#ffffff");
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark() ? "#14252c" : "#1a2930",
          titleColor: "#fffaf0",
          bodyColor: "#e8f0f4",
          borderColor: cobalt,
          borderWidth: 1,
          cornerRadius: 6,
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: text, maxTicksLimit: 7 }
        },
        y: {
          beginAtZero: true,
          grid: { color: line },
          ticks: { color: text, maxTicksLimit: 5 }
        }
      },
      elements: {
        line: { tension: 0.32, borderWidth: 2 },
        point: { radius: 0, hoverRadius: 4, hoverBorderWidth: 2 }
      },
      animation: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? false : { duration: 420 },
      color: text,
      backgroundColor: surface,
      colors: { cobalt: cobalt, bronze: bronze, cinnabar: cinnabar }
    };
  }

  function renderCharts() {
    if (!window.Chart) return;
    document.querySelectorAll("canvas[data-qmah-chart]").forEach(function (canvas) {
      const existing = window.Chart.getChart ? window.Chart.getChart(canvas) : null;
      if (existing) existing.destroy();
      const options = chartOptions();
      const cobalt = options.colors.cobalt;
      const bronze = options.colors.bronze;
      const cinnabar = options.colors.cinnabar;
      const line = getComputedStyle(body).getPropertyValue("--qmah-line-soft").trim() || "#e8eeeb";
      new window.Chart(canvas, {
        type: "bar",
        data: {
          labels: ["公開", "隱藏", "已刪除"],
          datasets: [
            {
              label: "社群貼文",
              data: [41, 4, 4],
              borderColor: [cobalt, bronze, cinnabar],
              backgroundColor: [cobalt, bronze, cinnabar],
              borderRadius: 5,
              maxBarThickness: 28
            }
          ]
        },
        options: Object.assign({}, options, {
          indexAxis: "y",
          plugins: Object.assign({}, options.plugins, {
            legend: { display: false }
          }),
          scales: Object.assign({}, options.scales, {
            x: Object.assign({}, options.scales.x, { suggestedMax: 45, grid: { color: line } }),
            y: Object.assign({}, options.scales.y, { grid: { display: false } })
          })
        })
      });
    });
  }

  function initTableSearch() {
    const input = document.querySelector("[data-qmah-table-search]");
    if (!input) return;
    const rows = Array.from(document.querySelectorAll("[data-qmah-row]"));
    const empty = document.querySelector("[data-qmah-empty]");
    const category = document.querySelector('[data-qmah-filter="category"]');
    const era = document.querySelector('[data-qmah-filter="era"]');

    function applyFilters() {
      const query = input.value.trim().toLowerCase();
      const categoryValue = category && category.value !== "全部分類" ? category.value : "";
      const eraValue = era && era.value !== "全部年代" ? era.value : "";
      let visible = 0;
      rows.forEach(function (row) {
        const cells = row.cells;
        const rowText = (row.getAttribute("data-search-text") || row.textContent).toLowerCase();
        const rowEra = cells[1] ? cells[1].textContent.trim() : "";
        const rowCategory = cells[2] ? cells[2].textContent.trim() : "";
        const matches = (!query || rowText.includes(query))
          && (!categoryValue || rowCategory === categoryValue)
          && (!eraValue || rowEra.includes(eraValue));
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      if (empty) empty.classList.toggle("is-visible", visible === 0);
    }

    input.addEventListener("input", applyFilters);
    [category, era].forEach(function (control) {
      if (control) control.addEventListener("change", applyFilters);
    });
    document.querySelectorAll("[data-qmah-filter-submit]").forEach(function (button) {
      button.addEventListener("click", applyFilters);
    });
  }

  function initFileInputs() {
    document.querySelectorAll("[data-qmah-file-input]").forEach(function (input) {
      input.addEventListener("change", function () {
        const label = document.querySelector(input.getAttribute("data-qmah-file-label"));
        if (label) label.textContent = input.files && input.files[0] ? input.files[0].name : "尚未選擇檔案";
      });
    });
  }

  function initSystemLinks() {
    const sections = {
      catalog: "artifacts.html",
      game: "game.html",
      social: "social.html",
      store: "store.html",
      user: "users.html"
    };
    document.querySelectorAll("[data-qmah-system]").forEach(function (link) {
      const target = sections[link.getAttribute("data-qmah-system")];
      if (target) link.setAttribute("href", target);
    });
  }

  function initTemplateSwitch() {
    const target = document.querySelector(
      ".qmah-topbar .navbar-nav.flex-row, .header-desktop .header-button, .app-header .navbar-nav.ms-auto"
    );
    if (!target || target.querySelector(".qmah-template-switch")) return;

    const link = document.createElement("a");
    link.className = "qmah-template-switch";
    link.href = "../index.html";
    link.setAttribute("aria-label", "返回三套模板選擇");
    link.innerHTML = '<svg class="qmah-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="4" y="14" width="6" height="6"></rect><rect x="14" y="14" width="6" height="6"></rect></svg><span class="qmah-template-switch__label">模板選擇</span>';

    const wrapper = document.createElement(target.matches("ul") ? "li" : "div");
    wrapper.className = target.matches("ul") ? "nav-item" : "qmah-template-switch-wrap";
    wrapper.append(link);
    target.prepend(wrapper);
  }

  const operationViews = {
    game: {
      title: "遊戲管理",
      subtitle: "遊戲房間、回合與題庫關聯",
      action: "建立遊戲房間",
      stats: [["進行中房間", "2", "目前房間"], ["遊戲玩家", "18", "在線玩家"], ["已啟用題庫", "256", "可用題目"]],
      statusColumns: [1, 2],
      columns: ["房間代碼", "狀態", "可見性", "人數上限", "回合", "操作"],
      rows: [["QMAH-7K2M", "進行中", "公開", "4 / 6", "3 / 5", "編輯"], ["QMAH-4P8A", "等待中", "私人", "2 / 4", "—", "編輯"], ["QMAH-2N6C", "已完成", "公開", "6 / 6", "8 / 8", "編輯"]],
      secondaryTitle: "題庫與回合設定",
      secondaryStatusColumns: [4],
      secondaryColumns: ["題庫", "分類篩選", "題目數", "難度", "啟用狀態", "操作"],
      secondaryRows: [["典藏辨識題庫", "陶瓷", "86", "2–4", "啟用", "編輯"], ["器物年代挑戰", "玉器", "54", "3–5", "啟用", "編輯"], ["銘文鑑識入門", "銅器", "32", "1–3", "停用", "編輯"]]
    },
    social: {
      title: "社群管理",
      subtitle: "社群貼文、留言與內容檢舉",
      action: "新增貼文",
      stats: [["社群貼文", "49", "全部貼文"], ["待處理檢舉", "1", "需要處理"], ["社群留言", "132", "全部留言"]],
      statusColumns: [2],
      columns: ["貼文標題", "看板", "狀態", "建立時間", "關聯文物", "操作"],
      rows: [["從青瓷釉色看汝窯", "ARTIFACT", "公開", "2026/08/13", "汝窯 青瓷盤", "編輯"], ["玉器的沁色判讀", "DISCUSSION", "公開", "2026/08/12", "玉劍璏", "編輯"], ["來源資料需要補充", "REPORT", "隱藏", "2026/08/11", "畫花卉 冊", "編輯"]],
      secondaryTitle: "待處理內容",
      secondaryStatusColumns: [4],
      secondaryColumns: ["類型", "內容摘要", "檢舉原因", "回報時間", "處理狀態", "操作"],
      secondaryRows: [["貼文", "來源資料需要補充", "資料錯誤", "2026/08/13 14:32", "待處理", "編輯"], ["留言", "這件應該不是北宋……", "不實內容", "2026/08/12 20:18", "已檢視", "編輯"], ["留言", "外部商城連結", "廣告訊息", "2026/08/11 09:06", "已隱藏", "編輯"]]
    },
    store: {
      title: "商城管理",
      subtitle: "商品、訂單與付款狀態",
      action: "新增商品",
      stats: [["上架商品", "6", "目前上架"], ["待付款訂單", "2", "待處理"], ["本月訂單", "12", "近 30 天"]],
      statusColumns: [4],
      columns: ["商品名稱", "分類", "售價", "庫存", "上下架", "操作"],
      rows: [["汝窯青瓷盤複製品", "陶瓷", "NT$ 1,280", "24", "上架", "編輯"], ["翠玉白菜收藏明信片", "紙品", "NT$ 180", "86", "上架", "編輯"], ["毛公鼎銘文筆記本", "文具", "NT$ 320", "0", "下架", "編輯"]],
      secondaryTitle: "最近訂單",
      secondaryStatusColumns: [2],
      secondaryColumns: ["訂單編號", "收件人", "付款狀態", "應付金額", "建立時間", "操作"],
      secondaryRows: [["QMAH-20260813-001", "林怡君", "待付款", "NT$ 1,280", "2026/08/13", "編輯"], ["QMAH-20260812-004", "陳柏宇", "已付款", "NT$ 860", "2026/08/12", "編輯"], ["QMAH-20260811-009", "王思妤", "已出貨", "NT$ 2,460", "2026/08/11", "編輯"]]
    },
    user: {
      title: "會員管理",
      subtitle: "會員帳號、角色、個人檔案與近期活動",
      action: "新增會員",
      stats: [["會員帳號", "128", "全部帳號"], ["本月新增", "14", "近 30 天"], ["停用帳號", "4", "目前停用"]],
      statusColumns: [3],
      columns: ["會員", "電子郵件", "角色", "帳號狀態", "最後登入", "操作"],
      rows: [["林怡君", "yichun.lin@example.com", "一般會員", "啟用", "2026/08/13 16:42", "編輯"], ["陳柏宇", "po-yu.chen@example.com", "內容編輯", "啟用", "2026/08/13 11:08", "編輯"], ["王思妤", "szu-yu.wang@example.com", "一般會員", "停用", "2026/07/29 20:16", "編輯"]],
      secondaryTitle: "個人檔案與近期活動",
      secondaryStatusColumns: [2],
      secondaryColumns: ["會員", "暱稱", "檔案可見性", "收藏數", "貼文／留言", "最近活動", "操作"],
      secondaryRows: [["林怡君", "青瓷觀察者", "公開", "24", "8 / 17", "收藏汝窯 青瓷盤", "編輯"], ["陳柏宇", "藏品筆記", "好友", "16", "12 / 31", "編輯圖鑑資料", "編輯"], ["王思妤", "玉器研究室", "私人", "9", "3 / 6", "更新個人檔案", "編輯"]],
      achievementColumns: ["成就名稱", "代碼", "條件類型", "門檻", "狀態", "取得人數", "操作"],
      achievementRows: [["完成第一場鑑定", "FIXTURE_FIRST_ROOM", "GAME_COMPLETED", "1", "啟用", "1", "編輯"]]
    }
  };

  const operationForms = {
    game: [
      ["房間代碼", "GameRoom.RoomCode", "text", "QMAH-7K2M"], ["狀態", "GameRoom.Status", "select", "進行中|等待中|已完成"], ["可見性", "GameRoom.Visibility", "select", "公開|私人"], ["人數上限", "GameRoom.MaxPlayers", "number", "6"], ["總回合數", "GameRoom.TotalRounds", "number", "5"], ["答題秒數", "GameRoom.AnswerSeconds", "number", "30"], ["投票秒數", "GameRoom.VotingSeconds", "number", "20"], ["分類篩選代碼", "GameRoom.CategoryFilterCode", "text", "CERAMIC"]
    ],
    social: [
      ["看板代碼", "SocialPost.BoardCode", "text", "ARTIFACT"], ["作者 UserId", "SocialPost.UserId", "text", "8f8c7a3d-9e61-4d5f-a2e4-2f55a9b8c120"], ["貼文標題", "SocialPost.Title", "text", "從青瓷釉色看汝窯"], ["關聯文物 ArtifactId", "SocialPost.ArtifactId", "text", "故瓷018182N000000000"], ["狀態", "SocialPost.Status", "select", "公開|隱藏|已刪除"], ["內容", "SocialPost.Content", "textarea", "記錄汝窯青瓷盤的釉色與器形觀察。"]
    ],
    store: [
      ["商品名稱", "Product.Name", "text", "汝窯青瓷盤複製品"], ["分類代碼", "Product.CategoryCode", "text", "CERAMIC"], ["關聯文物 ArtifactId", "Product.ArtifactId", "text", "故瓷018182N000000000"], ["商品尺寸", "Product.SizeText", "text", "高 3.2 公分"], ["售價", "Product.Price", "number", "1280"], ["庫存", "Product.Stock", "number", "24"], ["商品說明", "Product.Description", "textarea", "以館藏資料為靈感製作的展示商品。"], ["商品狀態", "Product.IsActive", "select", "啟用|停用"]
    ],
    user: [
      ["電子郵件", "ApplicationUser.Email", "email", "yichun.lin@example.com"], ["帳號狀態", "ApplicationUser.Status", "select", "啟用|停用"], ["暱稱", "UserProfile.Nickname", "text", "青瓷觀察者"], ["檔案可見性", "UserProfile.Visibility", "select", "公開|好友|私人"], ["個人簡介", "UserProfile.Bio", "textarea", "記錄館藏與文物觀察。"]
    ]
  };

  function renderSystemIcon(section) {
    const paths = {
      game: '<path d="M7 7h10l3 3-2 7H6l-2-7 3-3zM8 7l2-3h4l2 3M8 13h8M10 16h4"></path>',
      social: '<path d="M5 5h14v10H9l-4 4V5zM8 9h8M8 12h5"></path>',
      store: '<path d="M5 8h14l-1 11H6L5 8zM8 8a4 4 0 0 1 8 0M9 12h6"></path>',
      user: '<path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 0 0 0-6M17 15h1a3 3 0 0 1 3 3v2"></path>'
    };
    return `<svg class="qmah-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[section] || ""}</svg>`;
  }

  function sectionPage(section, form) {
    const pages = { game: "game.html", social: "social.html", store: "store.html", user: "users.html" };
    return `${pages[section]}${form ? "?view=form" : ""}`;
  }

  function renderOperationForm(section) {
    const view = operationViews[section];
    const fields = operationForms[section] || [];
    const fieldMarkup = fields.map(function (field, index) {
      const id = `${section}-field-${index}`;
      const control = field[2] === "textarea"
        ? `<textarea class="qmah-ops-form__control" id="${id}" rows="4">${field[3]}</textarea>`
        : field[2] === "select"
          ? `<select class="qmah-ops-form__control" id="${id}">${field[3].split("|").map(function (option, optionIndex) { return `<option${optionIndex === 0 ? " selected" : ""}>${option}</option>`; }).join("")}</select>`
          : `<input class="qmah-ops-form__control" id="${id}" type="${field[2]}" value="${field[3]}">`;
      return `<label class="qmah-ops-form__field${field[2] === "textarea" ? " qmah-ops-form__field--wide" : ""}" for="${id}"><span>${field[0]}</span>${control}</label>`;
    }).join("");
    return `<section class="qmah-operations"><header class="qmah-operations__header"><div><span class="qmah-operations__eyebrow">QMAH / ${section.toUpperCase()}</span><h1 class="qmah-operations__title"><span class="qmah-ops-title-mark" aria-hidden="true">${renderSystemIcon(section)}</span>${view.title}</h1><p class="qmah-operations__subtitle">${view.subtitle}</p></div><div class="qmah-operations__actions"><a class="qmah-ops-button qmah-ops-button--quiet" href="${sectionPage(section)}">取消</a><a class="qmah-ops-button" href="${sectionPage(section)}">儲存資料</a></div></header><section class="qmah-ops-card"><div class="qmah-ops-card__header"><div><h2>${view.title}資料</h2><p>基本資料</p></div></div><div class="qmah-ops-form-grid">${fieldMarkup}</div><div class="qmah-ops-card__footer"><span>最近更新：2026/08/13</span><a class="qmah-ops-link" href="${sectionPage(section)}">返回清單</a></div></section></section>`;
  }

  function renderOperationView(section) {
    const view = operationViews[section];
    if (!view) return "";
    const stats = view.stats.map(function (item) {
      return `<article class="qmah-ops-stat"><span class="qmah-ops-stat__label">${item[0]}</span><strong>${item[1]}</strong><small>${item[2]}</small></article>`;
    }).join("");
    const rows = view.rows.map(function (row) {
      return `<tr data-qmah-ops-row data-search-text="${row.join(" ")}">${row.map(function (cell, index) {
        if (index === row.length - 1) return `<td class="qmah-ops-table__action"><a class="qmah-ops-link" href="${sectionPage(section, true)}">${cell}</a></td>`;
        if (view.statusColumns.includes(index)) return `<td><span class="qmah-status ${cell === "公開" || cell === "已付款" || cell === "已出貨" || cell === "啟用" || cell === "上架" || cell === "進行中" ? "qmah-status--success" : cell === "待付款" || cell === "等待中" || cell === "隱藏" || cell === "下架" ? "qmah-status--warning" : "qmah-status--info"}">${cell}</span></td>`;
        return `<td>${cell}</td>`;
      }).join("")}</tr>`;
    }).join("");
    const secondary = view.secondaryRows ? `<section class="qmah-ops-card" aria-labelledby="${section}-secondary-title"><div class="qmah-ops-card__header"><div><h2 id="${section}-secondary-title">${view.secondaryTitle}</h2><p>共 ${view.secondaryRows.length} 筆</p></div></div><div class="table-responsive"><table class="qmah-ops-table"><thead><tr>${view.secondaryColumns.map(function (column) { return `<th>${column}</th>`; }).join("")}</tr></thead><tbody>${view.secondaryRows.map(function (row) { return `<tr>${row.map(function (cell, index) { const isAction = view.secondaryColumns[index] === "操作"; const isStatus = (view.secondaryStatusColumns || []).includes(index); const positive = ["啟用", "已付款", "已出貨", "已檢視", "已隱藏", "公開"].includes(cell); if (isAction) return `<td class="qmah-ops-table__action"><a class="qmah-ops-link" href="${sectionPage(section, true)}">${cell}</a></td>`; return isStatus ? `<td><span class="qmah-status ${positive ? "qmah-status--success" : "qmah-status--warning"}">${cell}</span></td>` : `<td>${cell}</td>`; }).join("")}</tr>`; }).join("")}</tbody></table></div></section>` : "";
    const achievements = view.achievementRows ? `<section class="qmah-ops-card" aria-labelledby="achievement-list-title"><div class="qmah-ops-card__header"><div><h2 id="achievement-list-title">成就管理</h2><p>成就定義與會員取得狀態</p></div><button class="qmah-ops-button" type="button">＋ 新增成就</button></div><div class="table-responsive"><table class="qmah-ops-table"><thead><tr>${view.achievementColumns.map(function (column) { return `<th>${column}</th>`; }).join("")}</tr></thead><tbody>${view.achievementRows.map(function (row) { return `<tr>${row.map(function (cell, index) { if (index === row.length - 1) return `<td class="qmah-ops-table__action"><button class="qmah-ops-link" type="button">${cell}</button></td>`; if (index === 4) return `<td><span class="qmah-status qmah-status--success">${cell}</span></td>`; return `<td>${cell}</td>`; }).join("")}</tr>`; }).join("")}</tbody></table></div></section>` : "";
    return `<section class="qmah-operations" data-qmah-operations-view>
      <header class="qmah-operations__header"><div><span class="qmah-operations__eyebrow">QMAH / ${section.toUpperCase()}</span><h1 class="qmah-operations__title"><span class="qmah-ops-title-mark" aria-hidden="true">${renderSystemIcon(section)}</span>${view.title}</h1><p class="qmah-operations__subtitle">${view.subtitle}</p></div><div class="qmah-operations__actions"><button class="qmah-ops-button qmah-ops-button--quiet" type="button">篩選</button><a class="qmah-ops-button" href="${sectionPage(section, true)}">＋ ${view.action}</a></div></header>
      <div class="qmah-ops-stats">${stats}</div>
      <section class="qmah-ops-card" aria-labelledby="${section}-list-title"><div class="qmah-ops-card__header"><div><h2 id="${section}-list-title">${section === "store" ? "商品列表" : `${view.title}清單`}</h2><p>共 ${view.rows.length} 筆</p></div><label class="qmah-ops-search"><i class="bi bi-search" aria-hidden="true"></i><span class="visually-hidden">搜尋${view.title}</span><input type="search" data-qmah-ops-search placeholder="搜尋清單"></label></div><div class="table-responsive"><table class="qmah-ops-table"><thead><tr>${view.columns.map(function (column) { return `<th>${column}</th>`; }).join("")}</tr></thead><tbody>${rows}</tbody></table></div><div class="qmah-ops-card__footer"><span>顯示 1–${view.rows.length} 筆</span><div class="qmah-ops-pagination"><button type="button" disabled>上一頁</button><button type="button" class="is-active">1</button><button type="button">下一頁</button></div></div></section>${secondary}${achievements}
    </section>`;
  }

  function initOperationsRoute() {
    const pageSections = { "game.html": "game", "social.html": "social", "store.html": "store", "users.html": "user" };
    const pageName = window.location.pathname.split("/").pop().toLowerCase();
    const section = pageSections[pageName] || new URLSearchParams(window.location.search).get("section");
    if (!operationViews[section]) return;
    const viewMode = new URLSearchParams(window.location.search).get("view");
    const html = viewMode === "form" ? renderOperationForm(section) : renderOperationView(section);
    const title = operationViews[section].title;
    document.title = `${title}｜清明鑑定屋後台`;
    const pageTitle = document.querySelector(".page-title, .page-header h1, .app-content-header h1");
    if (pageTitle) pageTitle.textContent = title;
    const outerHeader = document.querySelector(".page-header, .app-content-header");
    if (outerHeader) outerHeader.hidden = true;
    const subtitle = document.querySelector(".page-header .subtitle, .page-header p, .page-pretitle");
    if (subtitle && !subtitle.closest(".qmah-operations")) subtitle.textContent = operationViews[section].subtitle;
    const tablerBody = document.querySelector(".page-body");
    const coolBody = document.querySelector(".main-content .container-fluid");
    const adminBody = document.querySelector(".app-content");
    if (tablerBody) tablerBody.innerHTML = `<div class="container-xl">${html}</div>`;
    else if (coolBody) coolBody.innerHTML = html;
    else if (adminBody) adminBody.innerHTML = `<div class="container-fluid">${html}</div>`;
    document.querySelectorAll("[data-qmah-system]").forEach(function (link) {
      const active = link.getAttribute("data-qmah-system") === section;
      const item = link.closest("li, .nav-item");
      if (item) item.classList.toggle("active", active);
      link.classList.toggle("active", active);
    });
    const search = document.querySelector("[data-qmah-ops-search]");
    if (search) search.addEventListener("input", function () {
      const query = search.value.trim().toLowerCase();
      document.querySelectorAll("[data-qmah-ops-row]").forEach(function (row) {
        row.hidden = query && !(row.getAttribute("data-search-text") || "").toLowerCase().includes(query);
      });
    });
  }

  function initValidation() {
    document.querySelectorAll("form[data-qmah-validation]").forEach(function (form) {
      const summary = form.querySelector("[data-qmah-validation-summary]");
      const status = form.querySelector("[data-qmah-form-status]");
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const required = Array.from(form.querySelectorAll("[required]"));
        const invalid = required.filter(function (field) {
          const isInvalid = !field.value.trim();
          field.classList.toggle("is-invalid", isInvalid);
          return isInvalid;
        });
        if (summary) {
          summary.classList.toggle("is-visible", invalid.length > 0);
          summary.textContent = invalid.length ? "請先完成標示為必填的欄位，再儲存文物。" : "";
        }
        if (invalid.length) {
          invalid[0].focus();
          if (status) status.textContent = "";
          return;
        }
        const returnTo = form.getAttribute("data-qmah-return");
        if (returnTo) {
          window.location.href = returnTo;
          return;
        }
        if (status) status.textContent = "文物已儲存。";
      });
      form.querySelectorAll("[required]").forEach(function (field) {
        field.addEventListener("input", function () {
          if (field.value.trim()) field.classList.remove("is-invalid");
        });
      });
    });
  }

  function normalizeCoolAdminTheme() {
    if (!body.classList.contains("app")) return;
    body.classList.remove("theme-blue", "theme-purple", "theme-teal", "theme-rose", "theme-amber", "theme-graphite");
    const switcher = document.querySelector(".theme-switcher");
    if (switcher) switcher.remove();
  }

  function init() {
    normalizeCoolAdminTheme();
    initSystemLinks();
    initTemplateSwitch();
    document.querySelectorAll("[data-qmah-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyTheme(isDark() ? "light" : "dark");
      });
    });
    restoreTheme();
    initTableSearch();
    initFileInputs();
    initValidation();
    initOperationsRoute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
