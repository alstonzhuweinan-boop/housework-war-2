# 家务大作战 🧹

情侣家务打卡、计分与比赛的小程序

![家务大作战](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 功能特性

- ✅ **家务打卡** - 一键记录完成的家务，获得积分
- 📊 **排行榜** - 实时查看双方的家务积分排名
- 📈 **数据看板** - 近7天趋势图表，周/月/总积分统计
- 🏆 **比赛总览** - 日/周/月/年/总各维度获胜次数
- 📝 **历史记录** - 查看所有家务完成记录，支持撤销
- ⚙️ **项目管理** - 自定义家务项目和分值

## 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Firebase Firestore (实时数据同步)
- React Router v7
- Recharts (数据可视化)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run lint
```

开发服务器运行在 `http://localhost:3000`

## 部署到 Cloudflare Pages

### 方式一：Git 集成（推荐）

1. Fork 或推送代码到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Pages** → **Create a project**
4. 连接 GitHub 仓库
5. 构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**

### 方式二：GitHub Actions 自动部署

1. 在 Cloudflare Dashboard 获取:
   - Account ID (右上角)
   - API Token (My Profile → API Tokens → Create Token → Custom token)
2. 在 GitHub 仓库设置 Secrets:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
3. 推送代码到 main 分支，自动触发部署

### 方式三：Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist
```

## 配置说明

### Firebase 配置

项目使用 Firebase Firestore 作为后端。配置文件位于 `firebase-applet-config.json`，包含:

- Firestore 数据库连接
- 项目 ID 和 API Key

**注意**: 当前 Firestore 安全规则为开放模式，仅供个人使用。如需公开分享，请修改 `firestore.rules` 添加身份验证。

### 环境变量

项目不需要特殊环境变量即可运行。如果后续需要添加功能，可在 Cloudflare Pages 的 **Environment variables** 中设置。

## 项目结构

```
housework-war/
├── src/
│   ├── components/     # 通用组件
│   ├── contexts/       # React Context (Auth, Family)
│   ├── pages/          # 页面组件
│   ├── utils/          # 工具函数
│   ├── firebase.ts     # Firebase 初始化
│   ├── types.ts        # TypeScript 类型定义
│   └── main.tsx        # 应用入口
├── public/             # 静态资源
├── dist/               # 构建输出
├── wrangler.toml       # Cloudflare Pages 配置
├── .github/workflows/  # GitHub Actions
└── package.json
```

## 浏览器支持

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+
- iOS Safari 15+
- Android Chrome 90+

## 许可证

MIT License - 仅供个人学习和使用

## 致谢

- 图标: [Lucide React](https://lucide.dev)
- UI 组件样式: [Tailwind CSS](https://tailwindcss.com)
- 图表: [Recharts](https://recharts.org)
- 后端服务: [Firebase](https://firebase.google.com)
