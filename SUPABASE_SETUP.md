# Supabase 配置指南（大陆可用，跨设备同步）

## 1. 注册 Supabase

- 访问 https://supabase.com
- 用 GitHub 或邮箱注册（目前可注册）

## 2. 创建项目

- 点击 **New Project**
- 选择地区：**Singapore** 或 **Tokyo**（离大陆最近）
- 等待项目创建完成（约2分钟）

## 3. 获取连接信息

进入项目 → Settings → API：

```
Project URL: https://xxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIs...（很长的字符串）
```

## 4. 在 Cloudflare Pages 设置环境变量

1. 登录 https://dash.cloudflare.com
2. 进入你的 Pages 项目
3. Settings → Environment variables
4. 添加：
   - `VITE_SUPABASE_URL` = 你的 Project URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 anon key

## 5. 创建数据库表

在 Supabase Dashboard → SQL Editor，执行：

```sql
-- 家庭表
CREATE TABLE families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 家务项目表
CREATE TABLE chores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id TEXT REFERENCES families(id),
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  icon TEXT NOT NULL
);

-- 打卡记录表
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id TEXT REFERENCES families(id),
  chore_id TEXT NOT NULL,
  chore_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用实时订阅
ALTER TABLE chores REPLICA IDENTITY FULL;
ALTER TABLE records REPLICA IDENTITY FULL;
```

## 6. 重新部署

在 Cloudflare Pages 点击 **Retry deployment**

## 免费额度

- 500MB 数据库
- 1GB 存储
- 5万月活跃用户
- 足够你们两个人用

## 注意事项

- Supabase 服务器在境外，偶有波动但基本可用
- 比 Firebase 被墙的情况好得多
- 支持实时同步，跨设备秒级更新
