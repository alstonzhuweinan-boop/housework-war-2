# LeanCloud 配置（大陆可用，免费）

1. 注册 LeanCloud（国际版或国内版均可），创建应用。
2. 在应用设置中获取：
   - AppID
   - AppKey
   - Server URL
3. 在 Cloudflare Pages 项目中添加环境变量：
   - `VITE_LEANCLOUD_APP_ID`
   - `VITE_LEANCLOUD_APP_KEY`
   - `VITE_LEANCLOUD_SERVER_URL`
4. 重新部署。

## 首次登录会自动创建的数据类

- `Family`
- `Chore`
- `Record`

## Class 权限建议（开发阶段）

- `Family`：Find / Get / Create / Update 开启
- `Chore`：Find / Get / Create / Update / Delete 开启
- `Record`：Find / Get / Create / Delete 开启

生产阶段建议再细化 ACL。
