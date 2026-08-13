# CoolAdmin 與 ASP.NET Core MVC

正式導入時，將下列已編譯資產複製到 `QMAH.Web/wwwroot/`：

- `assets/css/`、`assets/js/`、`assets/fonts/`
- `assets/vendor/`
- `../shared/css/qmah-shared.css`
- `../shared/js/qmah-demo.js` 中正式專案需要的部分
- `../shared/brand/` 與文物媒體資產

將 `.page-wrapper` 與 `.page-container` 放入 `_Layout.cshtml`，側欄與頂部列分別拆為 `_Sidebar.cshtml`、`_Navbar.cshtml`，主要內容位置改成 `@RenderBody()`。一般組員使用已編譯資產不需要 Node.js；只有重新建置 CoolAdmin upstream 資產時才需要。
