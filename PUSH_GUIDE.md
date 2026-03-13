# 推送到 GitHub 指南

## 方法：使用 GitHub Desktop（最简单）

### 步骤 1：下载安装 GitHub Desktop
1. 访问 https://desktop.github.com
2. 下载并安装
3. 登录你的 GitHub 账号

### 步骤 2：添加本地仓库
1. 打开 GitHub Desktop
2. 点击 **File** → **Add local repository**
3. 选择文件夹：`C:\Users\Alston\Desktop\Housework-War-main`
4. 点击 **Add repository**

### 步骤 3：推送到 GitHub
1. 在 GitHub Desktop 中，你应该能看到已提交的更改
2. 点击 **Publish repository**（发布仓库）
3. 选择：
   - **Name**: `housework-war-2`
   - **Description**: 家务大作战 - 情侣家务打卡小程序
   - 保持 **Keep this code private** 不勾选（如果你想公开）
4. 点击 **Publish repository**

完成！代码现在已经推送到 https://github.com/alstonzhuweinan-boop/housework-war-2

---

## 方法：使用命令行（需要配置 Token）

### 步骤 1：创建 Personal Access Token
1. 登录 GitHub → 右上角头像 → **Settings**
2. 左侧菜单最下方 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. 点击 **Generate new token (classic)**
5. 设置：
   - **Note**: Housework War Deploy
   - **Expiration**: 30 days（或 No expiration）
   - **Scopes**: 勾选 **repo**（完整仓库访问）
6. 点击 **Generate token**
7. **立即复制生成的 token**（只显示一次！）

### 步骤 2：推送代码

在终端执行：

```bash
cd C:\Users\Alston\Desktop\Housework-War-main

# 设置远程仓库
git remote add origin https://github.com/alstonzhuweinan-boop/housework-war-2.git

# 推送（会提示输入用户名和密码）
git push -u origin master
```

当提示输入时：
- **Username**: 你的 GitHub 用户名（alstonzhuweinan-boop）
- **Password**: 粘贴刚才复制的 Personal Access Token

---

## 下一步：Cloudflare Pages 部署

推送成功后，访问：
https://dash.cloudflare.com

按照以下步骤部署：

1. 点击 **Pages** → **Create a project**
2. 点击 **Connect to Git**
3. 授权 GitHub，选择 `housework-war-2` 仓库
4. 构建设置：
   - **Project name**: `housework-war`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 点击 **Save and Deploy**

等待 1-2 分钟，你的网站就会上线！
