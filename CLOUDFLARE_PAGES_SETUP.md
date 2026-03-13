# Cloudflare Pages 创建指南（替代 Workers）

## 为什么从 Workers 切换到 Pages？

- **Workers**: `*.workers.dev` 域名在大陆被墙 ❌
- **Pages**: `*.pages.dev` 域名在大陆访问更好 ✅

## 步骤

### 1. 删除现有的 Workers 项目（可选）

1. 登录 https://dash.cloudflare.com
2. 点击左侧 **Workers & Pages**
3. 找到 `housework-war-2` 项目
4. 进入项目 → Settings → General
5. 滚动到底部，点击 **Delete project**

### 2. 创建新的 Pages 项目

1. 在 Workers & Pages 页面，点击 **Create application**
2. 选择 **Pages** 标签
3. 点击 **Connect to Git**
4. 授权 GitHub，选择 `housework-war-2` 仓库
5. 点击 **Begin setup**

### 3. 配置构建设置

填写以下信息：

| 设置项 | 值 |
|--------|-----|
| **Project name** | housework-war（或 housework-war-2）|
| **Production branch** | master |
| **Framework preset** | None（或 Vite）|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

**高级设置**（可选）：
- Environment variables: 不需要设置

点击 **Save and Deploy**

### 4. 等待部署完成

- 构建时间：约 1-2 分钟
- 成功后会显示：`https://housework-war.pages.dev`

### 5. 测试访问

打开浏览器访问：
```
https://housework-war.pages.dev
```

## 重要提示

**关于 wrangler.jsonc**：
- Pages 项目不需要 wrangler.jsonc 文件
- SPA 路由由 Pages 自动处理
- 如果部署失败，删除 wrangler.jsonc 再试

**如果已经用 Workers 部署过**：
- 两个项目可以共存
- 直接创建 Pages 项目即可
- 不需要删除 Workers（但建议只用一个）

## 验证成功

部署成功后：
- ✅ 首页加载正常
- ✅ 登录页面正常
- ✅ 各个路由可以访问
- ✅ 大陆可以访问（比 workers.dev 好）

## 下一步

创建完成后，告诉我你的 Pages 域名，我帮你验证！
