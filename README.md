# shopify_seo_markdown_demo

一款本地运行的 Shopify 店铺首页健康检测工具，自动分析页面速度、SEO 状况和转化率优化点，生成 Markdown 格式诊断报告。

## 功能特点

- **页面速度分析**：HTML 大小、图片数量、外部资源统计
- **SEO 检测**：Title、Meta Description、H1、Alt 标签、Open Graph、Canonical URL
- **转化率优化**：CTA 按钮检测、移动端适配、订阅入口识别
- **Markdown 报告**：结构化输出，支持预览和下载
- **零外部依赖**：无需数据库、无需第三方 API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

```bash
npm start
```

### 3. 使用工具

1. 打开浏览器访问 `http://localhost:3000`
2. 输入 Shopify 店铺 URL（如 `https://example.myshopify.com`）
3. 点击"开始检测"
4. 查看或下载生成的 Markdown 报告

## 项目结构

```
shopify_seo_markdown_demo/
├── package.json              # 项目配置和依赖
├── server/
│   ├── index.js              # Express 服务入口
│   ├── routes/
│   │   └── analyze.js        # /api/analyze 接口路由
│   └── services/
│       ├── fetcher.js        # 页面抓取服务
│       ├── speedAnalyzer.js  # 页面速度分析
│       ├── seoAnalyzer.js    # SEO 状况分析
│       ├── croAnalyzer.js    # 转化率优化分析
│       └── reportGenerator.js# Markdown 报告生成
└── public/
    ├── index.html            # 前端页面
    ├── style.css             # 样式文件
    └── app.js                # 前端交互逻辑
```

## 技术栈

- **后端**：Node.js + Express
- **页面抓取**：Axios + Cheerio
- **前端**：原生 HTML/CSS/JavaScript
- **Markdown 渲染**：marked.js

## 检测项说明

### 页面速度
- HTML 文件大小统计
- 图片数量和大小估算
- 外部 CSS/JS 文件数量

### SEO 状况
- Title 标签（长度检测）
- Meta Description（存在性和长度）
- H1 标签数量
- 图片 Alt 属性覆盖率
- Open Graph 标签
- Canonical URL

### 转化率优化
- CTA 按钮检测（Add to Cart、Buy Now 等）
- 移动端 viewport 配置
- 订阅/表单入口识别