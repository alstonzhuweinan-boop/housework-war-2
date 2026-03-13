# Cloudflare Pages 部署修复指南

## 问题原因
`wrangler.toml` 文件导致 Cloudflare Pages 误以为这是一个 Workers 项目，而不是纯静态网站。

## 解决方案
已删除 `wrangler.toml` 文件。对于纯静态网站，Cloudflare Pages 只需要在 Dashboard 中配置构建设置，不需要 wrangler.toml。

## 正确的部署方式

### 方法 1：通过 Cloudflare Dashboard（推荐）

1. 登录 https://dash.cloudflare.com
2. 进入 **Pages** → **Create a project**
3. 选择 **Connect to Git**
4. 选择 `housework-war-2` 仓库
5. 配置构建设置：
   - **Project name**: `housework-war`
   - **Production branch**: `master`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**

### 方法 2：删除现有项目重新创建

如果之前创建的项目一直失败：

1. 在 Cloudflare Dashboard → Pages 中找到项目
2. 点击项目 → Settings → General
3. 滚动到底部，点击 **Delete project**
4. 重新按照方法 1 创建

### 方法 3：使用 Wrangler CLI 手动部署

如果 Git 集成有问题，可以手动部署：

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 创建 Pages 项目（首次）
wrangler pages project create housework-war

# 部署到 Pages
wrangler pages deploy dist --project-name=housework-war
```

## SPA 路由支持

`public/_redirects` 文件已配置好，支持 React Router 的客户端路由：
```
/* /index.html 200
```

## 推送更新

请推送删除 wrangler.toml 的更改：

```bash
cd C:\Users\Alston\Desktop\Housework-War-main
git add -A
git commit -m "Remove wrangler.toml for static site deployment"
git push origin master
```

或者使用 GitHub Desktop：
1. 打开 GitHub Desktop
2. 查看更改，应该显示 wrangler.toml 被删除
3. 填写提交信息，点击 Commit
4. 点击 Push origin

## 验证部署

部署成功后，访问：
- `https://housework-war.pages.dev` （或你的项目名称）

测试：
1. 首页加载正常
2. 登录功能正常
3. 各个路由可以正常访问
