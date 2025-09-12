# DeepracticeBrands

Deepractice 品牌资源管理仓库

## 📁 目录结构

```
DeepracticeBrands/
├── images/          # 品牌图片资源
│   ├── logo-*.png   # 公司 Logo 各种配色版本
│   ├── duck-*.png   # PromptX 鸭子吉祥物
│   ├── PromptX-*.png # PromptX 产品 Logo
│   └── docs-*.png   # Docs 文档中心 Logo
└── index.html       # 图片预览页面
```

## 🎨 品牌资源说明

### Logo 版本

- **logo-black.png** - 黑色版本，适用于浅色背景
- **logo-white.png** - 白色版本，适用于深色背景
- **logo-gray.png** - 灰色版本，中性色调
- **logo-lightblue.png** - 浅蓝色版本，品牌主色调
- **logo-midblue.png** - 中蓝色版本，品牌辅助色

### PromptX 产品标识

- **PromptX-transparent.png** - 透明背景版本
- **PromptX-white.png** - 白色背景版本
- **duck-transparent.png** - 鸭子吉祥物透明背景
- **duck-white.png** - 鸭子吉祥物白色背景
- **duck-reverse.png** - 鸭子吉祥物反色版本

### Docs 文档中心标识

- **docs-black.png** - 黑色版本，适用于浅色背景
- **docs-white.png** - 白色版本，适用于深色背景  
- **docs-dark.png** - 深色版本，中性色调
- **docs-transparent.png** - 透明背景版本

## 📝 管理规范

### 1. 命名规范

- Logo 文件命名：`logo-[颜色/用途].png`
- 产品标识命名：`[产品名]-[背景类型].png`
- 版本迭代命名：`[名称]-v[版本号].png`

### 2. 文件要求

- **格式**：优先使用 PNG（透明背景）或 SVG（矢量图）
- **分辨率**：至少 1024x1024px，保证高清显示
- **文件大小**：单个文件不超过 2MB
- **色彩模式**：RGB，sRGB 色彩空间

### 3. 添加新资源

1. 将新图片放入 `images/` 目录
2. 遵循命名规范
3. 更新本 README 中的资源说明
4. 提交时写明添加的资源用途

### 4. 使用指南

- **网站使用**：优先使用 SVG 或透明背景 PNG
- **印刷使用**：提供 CMYK 版本，分辨率至少 300dpi
- **社交媒体**：根据平台要求调整尺寸，保持比例

### 5. 版本控制

- 保留历史版本，使用 `-v1`, `-v2` 等后缀
- 重大更新时在 commit message 中说明变更内容
- 不删除旧版本，除非确认所有使用方已更新

## 🚀 部署说明

本仓库已配置 Cloudflare Pages 自动部署：

- **在线地址**：https://brands.deepractice.ai
- **预览地址**：通过 index.html 查看所有品牌资源
- **更新流程**：推送到 main 分支后自动部署

## 📞 联系方式

如需高分辨率原始文件或其他格式，请联系设计团队。
