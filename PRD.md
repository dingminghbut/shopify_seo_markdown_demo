# 📋 产品需求文档（PRD）

---

## 1. 项目名称与一句话介绍

**项目名称**：Shopify Homepage Health Checker

**一句话介绍**：一款本地运行的 Shopify 店铺首页健康检测工具，自动分析页面速度、SEO 和转化率优化点，生成 Markdown 诊断报告。

---

## 2. 背景与目标

### 背景
- Shopify 商家需要了解店铺首页的健康状况，但专业工具通常收费或配置复杂
- 作为技术 Demo 项目，展示 Node.js 全栈开发能力

### 目标
- ✅ 用户输入 Shopify 店铺 URL，一键获取健康检测报告
- ✅ 零外部依赖（无数据库、无第三方 API）
- ✅ 本地运行，快速启动
- ✅ 输出清晰的 Markdown 格式报告

---

## 3. 用户角色 & 使用场景

| 用户角色 | 使用场景 |
|---------|---------|
| 开发者/学习者 | 学习 Node.js 爬虫、页面分析技术，作为作品集项目 |
| Shopify 商家 | 快速检测自己店铺首页的基础健康状况 |

**典型使用流程**：
1. 启动本地服务
2. 打开浏览器访问前端页面
3. 输入 Shopify 店铺 URL（如 `https://example.myshopify.com`）
4. 点击"开始检测"
5. 等待分析完成，查看/下载 Markdown 报告

---

## 4. 核心功能列表

| 优先级 | 功能模块 | 具体内容 |
|-------|---------|---------|
| P0 | URL 输入与验证 | 前端输入框 + 基础 URL 格式校验 |
| P0 | 页面抓取 | 使用 Node.js 抓取目标页面 HTML |
| P0 | 页面速度分析 | HTML 大小、图片数量/大小、资源加载统计 |
| P0 | SEO 检测 | Title、Meta Description、H1、Alt 标签、Open Graph |
| P0 | 转化率优化检测 | CTA 按钮存在性、首屏关键元素、移动端 viewport |
| P0 | 报告生成 | 生成结构化 Markdown 报告 |
| P1 | 报告展示 | 前端页面渲染 Markdown 报告 |
| P1 | 报告下载 | 支持下载 `.md` 文件 |
| P2 | 加载动画 | 检测过程中显示进度提示 |

---

## 5. 技术选型建议

```
┌─────────────────────────────────────────────────┐
│                   技术栈                         │
├─────────────────────────────────────────────────┤
│  前端：HTML + CSS + Vanilla JS（或 Vue/React）   │
│  后端：Node.js + Express                        │
│  页面抓取：axios + cheerio                       │
│  Markdown 渲染：marked.js（前端）                │
│  数据库：无（内存处理）                           │
│  外部 API：无                                    │
└─────────────────────────────────────────────────┘
```

| 层级 | 技术选择 | 理由 |
|-----|---------|-----|
| 运行时 | Node.js 18+ | 项目要求 |
| Web 框架 | Express.js | 轻量、简单、适合 Demo |
| HTML 解析 | Cheerio | 类 jQuery 语法，无需浏览器环境 |
| HTTP 请求 | Axios | Promise 友好，处理简单 |
| 前端 | 原生 HTML/CSS/JS | 简洁，无构建步骤 |
| Markdown 渲染 | marked.js | 轻量级前端 Markdown 解析库 |

---

## 6. 项目结构建议

```
shopify-health-checker/
├── package.json
├── README.md
├── server/
│   ├── index.js              # Express 入口
│   ├── routes/
│   │   └── analyze.js        # /api/analyze 路由
│   └── services/
│       ├── fetcher.js        # 页面抓取
│       ├── speedAnalyzer.js  # 速度分析
│       ├── seoAnalyzer.js    # SEO 分析
│       ├── croAnalyzer.js    # 转化率分析
│       └── reportGenerator.js # Markdown 生成
├── public/
│   ├── index.html            # 前端页面
│   ├── style.css             # 样式
│   └── app.js                # 前端逻辑
└── .gitignore
```

---

## 7. 非功能性需求

| 类别 | 要求 |
|-----|-----|
| **性能** | 单次检测 < 10 秒完成 |
| **可用性** | 一条命令启动（`npm start`） |
| **兼容性** | 支持主流浏览器（Chrome/Firefox/Safari） |
| **错误处理** | 友好提示：URL 无效、页面无法访问、超时等 |
| **代码质量** | 模块化清晰，便于扩展分析维度 |

---

## 8. 检测项细节（参考）

### 8.1 页面速度分析
- [ ] HTML 文件大小（KB）
- [ ] 图片总数量 & 总大小估算
- [ ] 外部 CSS/JS 文件数量
- [ ] 是否启用 Gzip（检查 Content-Encoding）

### 8.2 SEO 检测
- [ ] `<title>` 存在性 & 长度（推荐 50-60 字符）
- [ ] `<meta name="description">` 存在性 & 长度
- [ ] `<h1>` 标签数量（推荐 1 个）
- [ ] 图片 `alt` 属性覆盖率
- [ ] Open Graph 标签（og:title, og:image）
- [ ] Canonical URL

### 8.3 转化率优化
- [ ] CTA 按钮检测（"Add to Cart", "Buy Now" 等关键词）
- [ ] 移动端 viewport meta 标签
- [ ] 是否有表单/订阅入口

---

## 9. Markdown 报告示例

```markdown
# 🏥 Shopify 店铺健康检测报告

**检测时间**：2024-01-15 14:30:22  
**目标 URL**：https://example.myshopify.com

---

## ⚡ 页面速度

| 指标 | 结果 | 建议 |
|-----|------|-----|
| HTML 大小 | 156 KB | ⚠️ 偏大，建议压缩 |
| 图片数量 | 12 张 | ✅ 正常 |
| 外部脚本 | 8 个 | ⚠️ 建议合并 |

## 🔍 SEO 状况

| 检测项 | 状态 | 详情 |
|-------|------|-----|
| Title | ✅ | "Example Store - Best Products" (42字符) |
| Meta Description | ❌ | 未设置 |
| H1 标签 | ✅ | 1 个 |

## 🎯 转化率优化

| 检测项 | 状态 |
|-------|------|
| CTA 按钮 | ✅ 发现 "Add to Cart" |
| 移动端适配 | ✅ viewport 已设置 |

---

## 📊 综合评分：72/100
```

---

# ❓ 开发前需要您补充的信息

当前描述已足够清晰，可直接开始开发。