# 产假政策核算台

面向企业 HR / Leave Admin 的中国产假政策核算工具。输入员工工作地、生育情况、产假起始日等条件，可得到法定假期、休假截止日、返岗日与逐段政策依据。

首批覆盖 20 个一、二线城市，政策结论附官方来源与人工复核提示。

## 在线使用

公开版本通过 GitHub Pages 提供。每次推送到 `main` 分支后，GitHub Actions 会自动构建并发布最新版本。

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev:pages
```

浏览器打开终端中显示的本地地址即可。

## 构建与验证

```bash
npm run build:pages
npm run lint
npm test
```

- `npm run build:pages`：生成 GitHub Pages 静态产物到 `dist-pages/`
- `npm run lint`：检查代码规范
- `npm test`：验证原有应用构建及产假计算用例

GitHub Pages 构建会自动根据仓库名设置资源子路径，因此可部署为 `https://<账号>.github.io/<仓库名>/`。

## 项目结构

- `app/data/policies.ts`：20 城政策数据和官方来源
- `app/lib/maternity.ts`：产假分段与日期核算逻辑
- `app/MaternityCalculator.tsx`：HR 核算页面
- `github-pages/`：静态站点入口
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动发布流程
- `docs/research/`：政策研究底稿

## 使用说明

本工具用于辅助 HR 初步核算和复核，不替代主管部门、公司制度或法律专业意见。遇到政策生效日期不匹配、单位审批型假期、区间型假期或官方口径存在张力时，页面会提示人工复核。

## 现有 Sites 版本

项目仍保留原有 Vinext / Sites 构建方式：

```bash
npm run dev
npm run build
```

GitHub Pages 静态构建与原有版本相互独立。
