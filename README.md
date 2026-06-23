# 🦞 Qu\_Claw（虾盘）

一键包下载https://1827962863.share.123865.com/123pan/jr6ujv-yy1wv   ，这个网盘浏览器下载免费不限速
> **插上 U 盘，双击启动，AI 随身携带**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

***

## 🙏 致谢与致敬

本项目基于以下优秀的开源项目构建，向原作者和社区致以最诚挚的感谢：

### 🦾 OpenClaw

**OpenClaw** 是一个备受瞩目的开源 AI 助手框架，核心理念是让 AI 从"对话"走向"执行"——即 AI 能够直接操控电脑完成任务。

- **核心理念**：AI 从"对话"走向"执行"，让 AI 真正成为你的数字助手
- **架构特点**：模块化设计，支持灵活接入各种大语言模型
- **开源地址**：<https://github.com/openclaw/openclaw>

### 🦞 U-claw（虾盘）

**U-claw（虾盘）** 是 OpenClaw 的便携化发行版本，专为解决国内用户配置复杂的问题而生。

- **核心价值**：解决配置痛点，让 AI 助手触手可及
- **便携特性**：U 盘运行，数据随身携带
- **国内优化**：全程国内镜像，无需翻墙

Qu\_Claw 项目在此基础上进行了本地化增强和功能扩展，为中文用户提供更友好的体验。

***

## 📖 项目简介

Qu\_Claw（虾盘）是一个**制作教程 + 全套源代码**，教你把 OpenClaw 做成 U 盘——插上任意电脑，双击就能用 AI。

**为什么叫虾盘？**

- Qu\_Claw = USB + Claw（虾钳）
- U 盘 + AI = 虾盘 🦞

**核心特性：**

- ✅ 免安装运行 — 插上 U 盘，双击启动脚本即可
- ✅ 跨平台支持 — Mac / Windows 双平台支持
- ✅ 国产模型优先 — DeepSeek、Kimi、通义千问等，无需翻墙
- ✅ 数据随身携带 — 所有配置和对话记录保存在 U 盘
- ✅ 10+ 中国本土化技能 — B站助手、微博发文、小红书写作等

***

## 🚀 快速开始

### 方式一：一键安装（推荐）

不需要 U 盘，一行命令直接装到电脑：

```bash
# Mac / Linux
curl -fsSL https://qu_claw.org/install.sh | bash

# Windows (PowerShell 管理员)
irm https://qu_claw.org/install.ps1 | iex
```

自动完成：Node.js 下载 → OpenClaw 安装 → 10 个中国技能 → 模型配置 → 启动脚本生成

### 方式二：制作便携版 U 盘

```bash
# 1. 克隆代码
git clone https://github.com/dongsheng123132/qu_claw.git

# 2. 补齐依赖（Node.js + OpenClaw，国内镜像，约 1 分钟）
cd qu_claw/portable && bash setup.sh

# 3. 拷贝到 U 盘
cp -R portable/ /Volumes/你的U盘/Qu_Claw/   # Mac
# 或 Windows 资源管理器直接拖过去
```

**完成！** 插上 U 盘，双击启动脚本就能用。

***

## 💻 使用方法

### Windows 用户

1. 双击 `Windows-Start.bat` 启动服务
2. 浏览器自动打开配置页面
3. 选择 AI 模型，填写 API Key
4. 开始对话！

### Mac 用户

1. 双击 `Mac-Start.command` 启动服务
2. 浏览器自动打开配置页面
3. 选择 AI 模型，填写 API Key
4. 开始对话！

***

## 🤖 支持的 AI 模型

### 国产模型（无需翻墙）

| 模型        | 推荐场景         |
| --------- | ------------ |
| DeepSeek  | 编程首选，极便宜     |
| Kimi K2.5 | 长文档，256K 上下文 |
| 通义千问 Qwen | 免费额度大        |
| 智谱 GLM    | 学术场景         |
| MiniMax   | 语音多模态        |
| 豆包 Doubao | 火山引擎         |

### 大模型聚合平台

**SophNet** — 提供 DS、GLM、Qwen、MiniMax、Kimi 等多家开源大模型，多达 50+ 种，一个 API Key 体验多个顶级大模型。

注册地址：<https://www.sophnet.com/#?code=4T6VKY>

### 国际模型

Claude · GPT · Gemini（需翻墙或中转）

***

## 📱 支持的聊天平台

| 平台       | 状态     | 说明                   |
| -------- | ------ | -------------------- |
| QQ       | ✅ 已预装  | 输入 AppID + Secret 即可 |
| 飞书       | ✅ 内置   | 企业首选                 |
| Telegram | ✅ 内置   | 海外推荐                 |
| WhatsApp | ✅ 内置   | Baileys 协议           |
| Discord  | ✅ 内置   | —                    |
| 微信       | ✅ 社区插件 | iPad 协议              |

***

## 📁 项目结构

```
Qu_Claw/
├── portable/                    # 便携版核心
│   ├── Windows-Start.bat        # Windows 启动脚本
│   ├── Windows-Menu.bat         # Windows 功能菜单
│   ├── Config.html              # 配置页面
│   ├── Welcome.html             # 欢迎页面
│   ├── SkillHub.html            # 技能中心
│   ├── skills-cn/               # 中国本土化技能
│   │   ├── bilibili-helper/     # B站助手
│   │   ├── china-search/        # 中国搜索
│   │   ├── china-translate/     # 中文翻译
│   │   ├── china-weather/       # 中国天气
│   │   ├── deepseek-helper/     # DeepSeek 助手
│   │   ├── douyin-script/       # 抖音脚本
│   │   ├── wechat-article/      # 微信文章
│   │   ├── weibo-poster/        # 微博发文
│   │   ├── xiaohongshu-writer/   # 小红书写作
│   │   └── zhihu-writer/        # 知乎写作
│   └── config-server/           # 配置服务器
├── qu_claw-app/                 # 桌面 App（Electron）
│   ├── src/                     # 源代码
│   ├── assets/                  # 图标资源
│   └── resources/               # 运行资源
├── README.md                    # 说明文档
└── LICENSE                      # MIT 许可证
```

***

## 🌐 国内镜像

所有脚本默认走国内镜像，无需翻墙：

| 资源       | 镜像                               |
| -------- | -------------------------------- |
| npm 包    | `registry.npmmirror.com`         |
| Node.js  | `npmmirror.com/mirrors/node`     |
| Electron | `npmmirror.com/mirrors/electron` |

***

## 🛠️ 开发与构建

### 桌面 App 开发

```bash
cd qu_claw-app
bash setup.sh            # 一键安装开发环境（国内镜像）
npm run dev              # 开发模式运行
npm run build:mac-arm64  # 打包 Mac ARM64
npm run build:win        # 打包 Windows
```

### 平台支持

| 平台                        | 状态 | 说明           |
| ------------------------- | -- | ------------ |
| Mac Apple Silicon (M1-M4) | ✅  | 便携版 + 桌面版    |
| Mac Intel (x64)           | ✅  | 便携版 + 桌面版    |
| Windows x64               | ✅  | 便携版 + 桌面版    |
| Linux x64（可启动 U 盘）        | ✅  | bootable/ 目录 |

***

## 📦 内置技能

Qu\_Claw 预装了 10+ 个中国本土化技能：

| 技能                    | 功能                   |
| --------------------- | -------------------- |
| 📺 bilibili-helper    | B站内容助手 - 标题描述优化、标签策略 |
| 🔍 china-search       | 中国搜索 - 针对中文内容优化      |
| 🌐 china-translate    | 中文翻译 - 高质量中英互译       |
| 🌤️ china-weather     | 中国天气 - 国内城市天气预报      |
| 🤖 deepseek-helper    | DeepSeek 助手 - 编程首选   |
| 🎬 douyin-script      | 抖音脚本 - 短视频内容创作       |
| 📝 wechat-article     | 微信文章 - 公众号内容撰写       |
| 📢 weibo-poster       | 微博发文 - 微博内容创作        |
| 📖 xiaohongshu-writer | 小红书写作 - 种草笔记生成       |
| 💡 zhihu-writer       | 知乎写作 - 问答内容创作        |

***

## ❓ 常见问题

**Q: 需要翻墙吗？**
不需要。安装和运行全程使用国内镜像，国产模型 API 直连。

**Q: U 盘需要多大？**
4GB+（完整约 2.3GB）。

**Q: 能分发吗？**
MIT 协议，随便复制分发。

**Q: Mac 提示"未验证的开发者"？**
右键脚本 → 打开。

***

## 🤝 贡献与支持

欢迎 PR！特别需要：Windows 脚本完善、教程翻译。

### 寻找技术伙伴

Qu\_Claw 是一个快速成长的开源项目，目前已有不少商业合作机会。

我们正在寻找：

- **技术伙伴** — 全栈 / Node.js / Electron / 脚本自动化
- **资源合作** — 渠道、内容、社区运营

如果你对 AI 工具的落地和商业化感兴趣，欢迎联系：

- 微信: hecare888
- GitHub: [@dongsheng123132](https://github.com/dongsheng123132)
- 官网: [qu\_claw.org](https://qu_claw.org)

***

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

***

**Made with 🦞 by** **[dongsheng](https://github.com/dongsheng123132)**
