# QMAH Admin UI 客製化比較

評估來自本次實作：Tabler、CoolAdmin、AdminLTE 都完成總覽與五個獨立管理頁、明暗模式、手機版、真實縮圖、資料表、篩選、狀態與示意表單。沒有修改 upstream 編譯檔，客製內容集中在 QMAH 樣式、共用資料與必要的頁面組合。

## 實作結果摘要

- 每套都有 `artifacts.html`、`game.html`、`social.html`、`store.html`、`users.html`，不是以查詢參數假裝成不同頁面。
- 圖鑑管理包含縮圖、名稱、原始年代、分類、尺寸、來源授權、啟用狀態、搜尋、篩選、分頁與圖鑑表單。
- 遊戲管理包含房間狀態、可見性、人數、回合，以及題庫分類、題目數、難度與啟用狀態。
- 社群管理包含貼文、看板、關聯文物，以及留言／貼文檢舉與處理狀態。
- 商城管理包含商品、分類、售價、庫存、上下架，以及最近訂單與付款／出貨狀態。
- 會員管理包含帳號、角色、停用狀態、最後登入、個人檔案、收藏與社群活動，並依 `user.Achievements`、`user.UserAchievements` 展示成就條件、門檻、狀態與取得情況。
- 三套頁面都提供返回模板選擇頁的入口；模板選擇頁在桌面以三欄並排呈現。

## 本次版面對齊與原生差異

三套使用同一份 QMAH 文案、館藏資料、縮圖、狀態數值與核心資訊順序。Dashboard 的 KPI、社群貼文狀態、營運提醒與圖鑑條目；五大管理入口的標題、欄位與示意資料也保持一致。

三套合計十五個管理頁（每套圖鑑、遊戲、社群、商城、會員）使用相同資訊順序與假資料。模板差異只留在殼層、元件外觀、原生互動和各自的色彩覆蓋。

五個入口固定一對一對應：圖鑑管理 `catalog`、遊戲管理 `game`、社群管理 `social`、商城管理 `store`、會員管理 `user`。其他系統的欄位不混進圖鑑管理頁，文物表單中的遊戲題庫只保留既有 `ArtifactQuestionEntry` 關聯資訊。

仍保留模板自身的差異：

- Tabler 的表格操作以右側圖示選單為主；CoolAdmin 以「編輯」按鈕搭配選單呈現；AdminLTE 使用 Bootstrap 按鈕與 `card` 結構。
- Tabler 與 CoolAdmin 保留各自原生側欄、頂部導覽、間距、斷點與互動行為；AdminLTE 保留 `app-wrapper`、`app-header`、`app-sidebar` 與 PushMenu。
- 三套模板都以獨立 HTML 提供文物、遊戲、社群、商城、會員管理頁，方便直接比較同一頁型在不同模板下的結果。

| 項目 | Tabler | CoolAdmin | AdminLTE |
| --- | --- | --- | --- |
| 初始修改難度 | 低；官方結構與變數容易定位 | 高；需先整理舊版 CSS、字型與桌機／手機殼層 | 中；殼層清楚，但需同時理解 AdminLTE 與 Bootstrap |
| 大幅換色 | 容易，CSS variables 覆蓋集中 | 可行，但需同時處理舊 theme variables | 可行，需對齊 AdminLTE 與 Bootstrap token |
| Typography | UI 字體可由共用變數集中替換，元件繼承正常 | 原版 Poppins 分散在 font-face 與元件規則，需額外覆蓋 | Bootstrap 基礎繼承清楚，少量標題權重需另外修正 |
| Sidebar | 官方結構清楚，少量覆蓋即可 | 可保留折疊行為，但高度與舊版規則需修正 | 原生 PushMenu 與 off-canvas 清楚 |
| Navbar | 原生 navbar 與 dropdown 可直接沿用，只需處理配色和密度 | 桌機 header 與 mobile header 分開，兩邊都要同步修改 | `app-header` 結構固定，Bootstrap dropdown 可直接沿用 |
| Cards | 原生 card、header、body 足以組成 KPI 與資料區塊 | 既有 card 可用，但部分間距與標題規則需覆蓋 | `card`、`info-box` 類型多，總覽拼裝速度快 |
| Tables | 響應式容器、hover、對齊與操作欄容易保持一致 | 基本 table 可保留，需補深色表頭與水平捲動 | Bootstrap table 語意直接，狀態與操作欄容易組合 |
| Forms | input、select、switch、驗證狀態與 focus 樣式完整 | 欄位可沿用，但舊輸入框尺寸與深色狀態需逐項修正 | Bootstrap form、switch 與 validation 元件完整 |
| Dark mode | 原生 `data-bs-theme` 支援完整 | 需額外建立並同步 dark variables | AdminLTE 4 與 Bootstrap 5 支援完整 |
| CSS override 負擔 | 低 | 中高 | 中，需避開 AdminLTE 既有變數層 |
| upstream 元件保留程度 | 高 | 高 | 高，本次保留原生殼層與互動 |
| ASP.NET Core MVC 導入 | compiled CSS／JS 較集中，Layout 與 Partial 邊界清楚 | 可行，但字型、Font Awesome、Bootstrap 與自有 JS 資產較多 | compiled assets 可直接放入 `wwwroot`，Layout 對應清楚 |
| 組員使用難度 | 元件 class 與 Bootstrap 習慣接近，接手成本最低 | 需辨識 CoolAdmin 舊 class 與額外覆寫，接手成本最高 | 熟悉 Bootstrap 後容易使用，但需知道 AdminLTE layout hooks |
| 未來繼續客製 | token 與少量 overrides 可持續擴充，影響範圍較可預測 | 可繼續改，但 specificity 與重複殼層會提高維護成本 | 可持續擴充，但需維持 AdminLTE token 與 Bootstrap token 同步 |
| upstream 更新 | 較容易，覆寫層較集中 | 較難，舊版規則與本機資產較容易衝突 | 可行，需同步 AdminLTE 與 Bootstrap 版本 |

## 實際客製負擔

本次實作遇到的問題由少到多為：`Tabler → AdminLTE → CoolAdmin`。

- Tabler 的變數、明暗模式與元件狀態最集中；大幅換色後，表格、表單、側欄與 RWD 較少需要個別補救。
- AdminLTE 的版面殼層與 Bootstrap 元件完整，但 AdminLTE token、Bootstrap token 與區域性的 `data-bs-theme` 會互相影響；本次需要額外修正側欄 Logo 與明暗表面層級。
- CoolAdmin 能保留既有殼層與互動，但舊 CSS、固定尺寸、Poppins 資產、較高 specificity 和手機／桌機兩套導覽，使換色與一致化需要最多覆寫。

這是本次 PoC 的修改成本紀錄，不是替團隊做最後選型；各套適合的情境仍列在下方。

## 各模板較有利的面向

### Tabler

- 色彩和元件狀態集中在 CSS variables，換成 QMAH 視覺時較容易維持一致。
- 原生 `data-bs-theme` 讓明暗模式能沿用同一套元件結構。
- 容器、網格、表格與表單的 Bootstrap 語意較直接，Razor 拆分時容易辨認。

### CoolAdmin

- 原始後台殼層完整，桌機側欄折疊、手機導覽與通知／帳號區都有現成行為。
- 既有的 dashboard 卡片、資料表、篩選列與帳號選單能快速拼出管理頁。
- 對偏傳統企業後台的資訊密度與固定版面，有較多現成樣式可直接使用。

### AdminLTE

- `app-wrapper`、`app-sidebar` 與 `app-header` 對大型後台的殼層分工明確，手機側欄與 PushMenu 有官方行為可沿用。
- Bootstrap 5 的表格、表單、分頁與下拉選單讓 MVC Razor 拆分時容易對應。
- `info-box`、`card`、`navbar` 等原生元件能快速拼出總覽與五大管理頁，不必另造元件基礎。

## 導入前應再驗證的面向

- Tabler：確認團隊偏好的資訊密度與既有 Razor 版面能否直接對齊。
- CoolAdmin：確認預設 theme 規則與高 specificity CSS 在更多頁面下的覆蓋成本。
- AdminLTE：確認團隊是否願意接受較明確的 Bootstrap／AdminLTE 結構與資產版本綁定。
- 三者：以正式權限、空資料、長中文、批次操作及真實 API 回應再做一輪驗證。
