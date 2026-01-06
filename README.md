# 灵棋经占卜 - Web 版

这是灵棋经占卜的 Web 版本，可以部署到 GitHub Pages 实现在线访问。

## 功能特点

- ✅ 完整的灵棋经占卜系统
- ✅ AI 智能解读
- ✅ 响应式设计，支持移动端
- ✅ 历史记录保存
- ✅ 优美的中国风 UI

## 本地预览

1. 克隆仓库
2. 直接在浏览器中打开 `web/index.html` 文件

## 部署到 GitHub Pages

### 方法一：使用 npm 命令部署

```bash
# 安装依赖
npm install

# 部署到 GitHub Pages
npm run deploy
```

### 方法二：使用 GitHub Actions 自动部署

1. 在 GitHub 上创建新仓库
2. 将代码推送到 GitHub
3. 在仓库设置中启用 GitHub Pages，选择 `gh-pages` 分支
4. 推送代码后会自动触发部署

### 方法三：手动部署

1. 在 GitHub 上创建新仓库
2. 推送代码到 GitHub
3. 运行部署命令
4. 在仓库 Settings → Pages 中配置 `gh-pages` 分支



## 目录结构

```
web/
├── index.html    # 主页面
├── style.css     # 样式文件
├── app.js        # 业务逻辑
└── README.md     # 说明文档
```

## 技术栈

- 纯 HTML/CSS/JavaScript
- 无需构建工具
- 支持现代浏览器

