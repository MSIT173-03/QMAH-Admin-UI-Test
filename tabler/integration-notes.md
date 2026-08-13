# Tabler 與 ASP.NET Core MVC

正式導入時，將下列已編譯資產複製到 `QMAH.Web/wwwroot/`：

- `assets/vendor/tabler.min.css`
- `assets/vendor/tabler.min.js`
- `assets/css/qmah-tabler.css`
- `../shared/css/qmah-shared.css`
- `../shared/js/qmah-demo.js` 中正式專案需要的部分
- `../shared/brand/` 與文物媒體資產

將頁面 shell 拆成 `_Layout.cshtml`，側欄與頂部列分別拆為 `_Sidebar.cshtml`、`_Navbar.cshtml`，主要內容位置改成 `@RenderBody()`。一般組員使用已編譯好的 UI 不需要 Node.js；只有修改 Tabler 原始 Sass 並重新編譯時才需要。
