# learn-anything · 学会任何知识

一个中文友好的学习 Skill，支持 **Codex** 和 **DeepSeek Harness（DSH）**。把学习目标转成可练习、可检验、可复习的过程，按需求选择学习模式，也可以串联成完整学习流程。

两端共用 [SKILL.md](SKILL.md)，无需转换提示词或添加 MCP 服务。`agents/openai.yaml` 是 Codex 的界面元数据；Harness 从 `SKILL.md` 读取名称、描述和指令。

## 六种模式

| 模式 | 用途 |
| --- | --- |
| 学习阶梯 | 五级递进，用练习和晋级证据定位水平。 |
| 集中练习计划 | 默认十次、每次两小时，并按实际预算调整。 |
| 主动回忆测验 | 默认十题，一次一题，依据实际作答评分和补讲。 |
| 一页速查 | 核心概念、短例、易错点和五道自检题。 |
| 资源筛选 | 核实并筛选五项资源，安排七天学习路径。 |
| 费曼复述 | 浅显解释 → 自己复述 → 修补缺口 → 再次复述。 |

## 安装

下载本仓库并解压，将直接包含 `SKILL.md` 的文件夹命名为 `learn-anything`，放入对应宿主的技能目录：

| 宿主 / 范围 | 安装后的入口文件 | 显式调用 |
| --- | --- | --- |
| Codex / 个人 | `~/.codex/skills/learn-anything/SKILL.md` | `$learn-anything` |
| DeepSeek Harness / 个人 | `~/.dsh/skills/learn-anything/SKILL.md` | `/learn-anything` |
| DeepSeek Harness / 项目 | `<项目根目录>/.dsh/skills/learn-anything/SKILL.md` | `/learn-anything` |

`~` 表示当前用户目录。设置了 `CODEX_HOME` 时，Codex 使用其下的 `skills/`；设置了 `DSH_HOME` 时，Harness 使用其下的 `skills/`。Harness 的项目根目录为最近包含 `.git` 的上级目录，没有 `.git` 时使用当前工作目录。

文件夹内应直接是以下结构，避免解压后多套一层目录：

```text
learn-anything/
├── SKILL.md
├── README.md
└── agents/
    └── openai.yaml
```

### DeepSeek Harness：使用 Git 安装到个人目录

已安装 Harness 和 Git 时，可以直接执行下列对应系统的命令。目标目录已存在时不要重复克隆；确认没有需要保留的本地修改后，在该目录运行 `git pull --ff-only` 更新。

**Windows PowerShell**

```powershell
$dshSkillHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME '.dsh' }
$dshSkillRoot = Join-Path $dshSkillHome 'skills'
New-Item -ItemType Directory -Force -Path $dshSkillRoot | Out-Null
git clone https://github.com/Primezyx/learn-anything-skill.git (Join-Path $dshSkillRoot 'learn-anything')
```

**macOS / Linux**

```bash
dsh_skill_root="${DSH_HOME:-$HOME/.dsh}/skills"
mkdir -p "$dsh_skill_root"
git clone https://github.com/Primezyx/learn-anything-skill.git "$dsh_skill_root/learn-anything"
```

项目安装也可以把同一文件夹放入 `<项目根目录>/.dsh/skills/`，再从该项目启动 Harness。个人安装和项目安装选一种即可。

## 调用示例

**Codex**

```text
使用 $learn-anything，带我从零学习 RAG，每天一小时，目标是做一个能引用资料的问答助手。
```

**DeepSeek Harness**：在聊天输入框发送，斜杠名称后保留空格。

```text
/learn-anything 带我从零学习 RAG，每天一小时，目标是做一个能引用资料的问答助手。
```

其他需求可接在对应调用标记后：

- 我零基础学 SQL，希望二十小时后能做月度销售分析。
- 考我概率论，一次一题，先别告诉我答案。
- 做一页 Git 分支速查表。
- 使用费曼复述模式，带我理解梯度下降。

只说“带我学习”时，会先给简短路径和第一项活动；无需一次使用所有模式。学习效果通过作答或作品检验，不承诺“十倍速”或短期成为专家。

## DeepSeek Harness 加载说明

Harness 使用 YAML 头部的 `name: learn-anything` 和 `description` 发现技能，再按需加载正文。此 Skill 保留默认的模型自动选择和用户显式调用；没有关闭任一种调用方式。`/learn-anything` 会将正文注入当前步骤，模型可直接开始辅导，无需再次调用 `skill` 工具加载同一正文。

如果未发现技能，依次检查：

1. 文件是否直接位于 `skills/learn-anything/SKILL.md`，而非额外嵌套的仓库目录中。
2. 当前 Harness 是否使用了不同的 `DSH_HOME`、自定义技能目录或项目目录。项目中的同名技能优先于个人目录中的版本。
3. 自定义 Harness 组合是否同时加载了 `@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-skill-filesystem` 和 `@deepseek-ai/dsh-tool-skill`。本仓库提供 Skill 文件，不需要用 `dsh plugin add` 把本仓库当成插件安装。

技能目录和调用行为依据 DeepSeek Harness 官方的[文件发现说明](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/skill/skill-filesystem/README.md)与[调用说明](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/skill/tool-skill/README.md)，核对日期为 2026-10-14。搜索、浏览等工具由运行环境提供；缺少联网工具时，Skill 会说明资源核验限制。

## 验证范围

2026-10-14 使用本机 DeepSeek Harness `0.1.2-rc.1` 的实际文件发现器和正文渲染器，在隔离目录中验证了项目安装、个人安装、正文完整读取，以及模型和用户调用权限均开启；Codex Skill 格式检查也已通过。未进行真实模型对话或界面中的斜杠调用端到端测试。

## 文件

- [SKILL.md](SKILL.md)：两端共用的触发条件、六种学习模式与执行规则。
- [agents/openai.yaml](agents/openai.yaml)：Codex 的名称、描述和默认调用提示。

## 来源与改编

方法来源于 Rahul（[@sairahul1](https://x.com/sairahul1)）的 [How To Learn Anything 10x Faster Using Claude](https://x.com/sairahul1/status/2068250224532050089)。**2026-10-14 已直接阅读全文，核对了六种学习方法及默认数量。**

初版创建于 2026-10-13；当时 X 原页返回 403，先参考了明确关联原文的[公开中文转载](https://www.jxxy.net/ai/articles/sairahul1-2068250224532050089/)。本 Skill 是方法概要的独立改写，没有复制整篇文章或整套提示词。模式路由、评分记录、资源核验、时间适配、续学处理及宿主适配为改编时增加的执行设计。
