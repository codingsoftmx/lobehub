#!/usr/bin/env python3
"""Rebrand README.zh-CN.md: replace LobeHub references with Agentes/CodingSoft."""

ZH_PATH = "/Users/codingsoft/github-prod/asistentes/lobehub/README.zh-CN.md"

with open(ZH_PATH, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    # Title
    ("# LobeHub\n", "# CodingSoft Agentes\n"),
    # Main headers with LobeHub
    ("**LobeHub 改变一切。**\n", "**Agentes 改变一切。**\n"),
    ("LobeHub 改变了这一切。", "Agentes 改变了这一切。"),
    ("LobeHub 是一个工作与生活空间，", "Agentes 是一个工作与生活空间，"),
    ("在 LobeHub 中，我们将 **Agent 视为工作单元**", "在 Agentes 中，我们将 **Agent 视为工作单元**"),
    ("LobeHub 引入了 **Agent Groups**", "Agentes 引入了 **Agent Groups**"),
    ("LobeHub 旨在成为所有人的 AI Agent 实验场", "Agentes 旨在成为所有人的 AI Agent 实验场"),
    ("LobeHub 目前正在积极开发中", "Agentes 目前正在积极开发中"),
    # Memory feature
    ("LobeHub 提供了构建清晰用户理解的 **个人记忆（Personal Memory）**", "Agentes 提供了构建清晰用户理解的 **个人记忆（Personal Memory）**"),
    # Docker/Deploy section
    ("LobeHub 提供了 Vercel 的 自托管版本 和 [Docker 镜像]", "Agentes 提供了 Vercel 的 自托管版本 和 [Docker 镜像]"),
    ("构建属于自己的 LobeHub", "构建属于自己的 Agentes"),
    ("用于在您自己的私有设备上部署 LobeHub 服务", "用于在您自己的私有设备上部署 Agentes 服务"),
    ("启动 LobeHub", "启动 Agentes"),
    # API Key section
    ("将此 API Key 填写到 LobeHub 的 API Key 配置", "将此 API Key 填写到 Agentes 的 API Key 配置"),
    # Ecosystem
    ("LobeHub 代码样式规范", "CodingSoft 代码样式规范"),
    # Plugin section
    ("插件提供了扩展 LobeHub", "插件提供了扩展 Agentes"),
    ("作为 LobeHub 插件的网关", "作为 Agentes 插件的网关"),
    # Footer / License
    ("Copyright © 2025 [LobeHub]", "Copyright © 2025 [CodingSoft]"),
    ("This project is [LobeHub Community License]", "This project is [Agentes Community License]"),
    # Share texts (social media sharing)
    ("分享 LobeHub 给你的好友", "分享 Agentes 给你的好友"),
    ("Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20LobeHub", "Check%20this%20GitHub%20repository%20out%20%F0%9F%A4%AF%20Agentes"),
    ("%E6%8E%A8%E8%8D%90%E4%B8%80%E4%B8%AA%20GitHub%20%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE%20%F0%9F%A4%AF%20LobeHub", "%E6%8E%A8%E8%8D%90%E4%B8%80%E4%B8%AA%20GitHub%20%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE%20%F0%9F%A4%AF%20Agentes"),
    # Product Hunt descriptions
    ("LobeHub - Your Chief Agent Operator for multi-agent work", "Agentes - Your Chief Agent Operator for multi-agent work"),
    ("LobeHub - 你的首席 Agent 运营官", "Agentes - 你的首席 Agent 运营官"),
    # Community / discussion
    ("加入我们的 Discord 社区！这是你可以与开发者和其他 LobeHub 热衷用户交流的地方", "加入我们的 Discord 社区！这是你可以与开发者和其他 Agentes 热衷用户交流的地方"),
    # Contribution section
    ("帮助我们将 LobeHub 建设得更好", "帮助我们将 Agentes 建设得更好"),
    # Product Hunt launch
    ("我们已在 Product Hunt 上线！我们很高兴将 LobeHub 推向世界", "我们已在 Product Hunt 上线！我们很高兴将 Agentes 推向世界"),
    # Discord
    ("这是你可以与开发者和其他 LobeHub 热衷用户交流的地方", "这是你可以与开发者和其他 Agentes 热衷用户交流的地方"),
    # GitHub links in text
    ("https://github.com/lobehub/lobehub", "https://github.com/codingsoftmx/lobehub"),
    # Profile link in footer
    ("[profile-link]: https://github.com/lobehub", "[profile-link]: https://github.com/codingsoftmx"),
    # Docker hub references
    ("lobehub/lobehub", "codingsoftmx/lobehub"),
    # Vercel deploy references
    ("lobehub%2Flobehub", "codingsoftmx%2Flobehub"),
    # Codespaces
    ("codespaces.new/lobehub/lobehub", "codespaces.new/codingsoftmx/lobehub"),
    # GitHub repo references in badges/shields
    ("repo=lobehub/lobehub", "repo=codingsoftmx/lobehub"),
    ("owner_id=131470832&repo_ids=643445235", "owner_id=codingsoftmx&repo_ids=lobehub"),
    # Open Collective
    ("opencollective.com/lobehub", "opencollective.com/codingsoftmx"),
    # Trendshift
    ("lobehub%2Flobehub", "codingsoftmx%2Flobehub"),
    # Sponsor images
    ("github.com/lobehub/.github/blob/main/static/sponsor", "github.com/codingsoftmx/.github/blob/main/static/sponsor"),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f"  ✅ Replaced: {old[:60]}...")
    else:
        print(f"  ⚠️  NOT FOUND: {old[:60]}...")

# Also replace remaining standalone "LobeHub" (not part of URLs or package names)
# First pass: replace "LobeHub" in Chinese prose context where it appears as standalone brand name
# We already did specific replacements above, but check for any remaining
remaining = content.count("LobeHub")
print(f"\n📊 Remaining 'LobeHub' occurrences: {remaining}")
if remaining > 0:
    print("Remaining lines with LobeHub:")
    for i, line in enumerate(content.split('\n')):
        if 'LobeHub' in line:
            print(f"  Line {i+1}: {line.strip()[:100]}")

with open(ZH_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\n✅ Total replacements: {count}")
print(f"✅ File written: {ZH_PATH}")
