# QMAH Admin UI Template Test

這是清明鑑定屋 QMAH 的後台模板客製化 PoC，比較 [Tabler 1.4.0](https://github.com/tabler/tabler)、[CoolAdmin 3.4.0](https://github.com/puikinsh/CoolAdmin) 與 [AdminLTE 4.3.1](https://github.com/ColorlibHQ/AdminLTE)。三套版本共用相同內容、Logo、色系與核心頁面，保留各自 upstream 的版面、元件及互動。

- `/tabler/`：總覽、圖鑑管理、文物表單
- `/cooladmin/`：總覽、圖鑑管理、文物表單
- `/adminlte/`：總覽、圖鑑管理、文物表單
- 三套版本的側邊欄都可直接切換文物、遊戲、社群、商城、會員五個管理頁；十五個管理頁共用同一份資訊配置。
- 展示資料依 QMAH 的 `catalog.Artifacts`、`catalog.ArtifactCategories`、`catalog.EraBuckets` 與 `game.ArtifactQuestionEntries` 設計。
- 文物縮圖沿用 QMAH repository 內已保存的故宮 Open Data 素材與姓名標示資料。

## 故宮館藏啟發色系

配色以故宮青花瓷的鈷藍、瓷白與低彩度青瓷灰為主，古銅與朱砂只用於次要資訊與狀態提示。這組 QMAH Palace-inspired palette 是從館藏與數位典藏的視覺印象推導，不是國立故宮博物院官方品牌色。

側邊導覽直接對應五個管理系統：文物、遊戲、社群、商城與會員；總覽只彙整跨系統待辦，不混入其他系統的管理欄位。

## 使用方式

這是純靜態網站，直接以 HTTP server 開啟即可。使用已編譯資產不需要 Node.js；只有重新建置 upstream 原始 Sass 或 JavaScript 時才需要 Node.js。

完整比較請見 [COMPARISON.md](COMPARISON.md)。第三方授權資訊放在 [LICENSES](LICENSES)。