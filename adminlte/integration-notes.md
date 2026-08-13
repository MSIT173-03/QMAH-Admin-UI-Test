# ASP.NET Core MVC 整合備註

AdminLTE 4.3.1 這份 PoC 已使用編譯後的 CSS／JS，正式導入時可直接複製到 `QMAH.Web/wwwroot/`：

- `assets/vendor/bootstrap-5.3.8.min.css`
- `assets/vendor/bootstrap-5.3.8.bundle.min.js`
- `assets/vendor/adminlte.min.css`
- `assets/vendor/adminlte.min.js`
- `assets/vendor/bootstrap-icons/`
- `assets/css/qmah-adminlte.css`
- `../shared/css/qmah-shared.css`
- `../shared/js/qmah-demo.js` 中實際需要的互動程式
- `../shared/brand/` 與 `../shared/media/catalog/` 內的品牌與縮圖資產

Razor 拆分時，AdminLTE 原生殼層可對應為：

- `_Layout.cshtml`：`app-wrapper`、`app-header`、`app-main`、footer 與 CSS／JS 引用
- `_Sidebar.cshtml`：`app-sidebar`、`sidebar-brand`、`sidebar-menu`
- `_Navbar.cshtml`：`app-header` 內的搜尋、通知、帳號與主題切換
- `@RenderBody()`：`app-content-header` 與 `app-content`

QMAH 組員只使用已完成的 UI 時不需要 Node.js；只要把編譯好的 CSS、JS、字型與圖片放進 `wwwroot`。只有要重新編譯 AdminLTE Sass、Bootstrap 或自行改動前端來源時，才需要 Node.js。
