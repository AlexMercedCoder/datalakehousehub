---
slug: "2026-03-context-management-opencode"
title: "OpenCode Context Management: Rules, Agents, Models, and MCP"
description: "Configure OpenCode project instructions, agent modes, model providers, context compaction, and MCP tools without relying on stale syntax."
date: 2026-03-15T10:00:00Z
pubDatetime: 2026-03-15T10:00:00Z
draft: false
image: "/images/blog.png"
author: "Alex Merced"
authors:
  - "Alex Merced"
categories:
  - "AI & Agents"
tags:
  - "OpenCode"
  - "context management"
  - "coding agents"
  - "MCP"
---

OpenCode builds context from the conversation, files it inspects or that you attach, project instructions, enabled tools, and the selected model's limits. Good context management is therefore less about loading the entire repository and more about giving the agent durable rules plus a narrow, verifiable task.

This guide was reviewed on September 11, 2026. OpenCode changes quickly, so use the linked official documentation to confirm configuration details before copying an example into production.

## The context layers

OpenCode context comes from five practical layers:

1. **Project instructions** describe commands, architecture, conventions, and boundaries.
2. **The current session** contains your prompts, tool results, and prior decisions.
3. **Repository files** are found through search or added deliberately.
4. **Tools and MCP servers** expose live systems and their tool descriptions.
5. **The selected model** determines the available context and behavior.

Keeping these layers distinct makes failures easier to diagnose. A coding-standard problem belongs in durable instructions; a one-off migration requirement belongs in the prompt; live ticket or database data belongs behind a constrained tool.

## Use the current configuration schema

OpenCode supports project configuration in `opencode.json` or `opencode.jsonc`. A minimal model selection looks like this:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
}
```

The model identifier and provider availability above are examples, not a recommendation. Select an identifier that your configured provider currently exposes. OpenCode merges configuration from supported locations, so a project can override user defaults.

Use the official [configuration guide](https://opencode.ai/docs/config/) and schema as the source of truth. Older articles often show a singular `provider` object or obsolete model names; both can produce confusing failures on a current installation.

## Put durable behavior in instructions

Project instructions should answer questions the agent would otherwise rediscover:

- Which build, format, lint, and test commands are authoritative?
- Which directories are generated or off-limits?
- What architectural boundaries must changes preserve?
- What counts as complete verification?
- Which risky operations require explicit approval?

OpenCode can use an `AGENTS.md` file and can reference additional instruction files through configuration. Keep the top-level file short and route detailed guidance to nearby documents. See the current [rules documentation](https://opencode.ai/docs/rules/) for discovery and precedence behavior.

Avoid pasting an entire style guide into every prompt. Durable rules are easier to review in version control and leave more context for the actual task.

## Plan and build agents

OpenCode includes primary agents for different modes of work. Plan mode is designed for analysis with restricted modification capabilities; build mode is designed to make changes. Additional agents can be configured for focused jobs.

A useful workflow is:

1. Ask the plan agent to identify affected files, constraints, and tests.
2. Review the proposed boundary and correct mistaken assumptions.
3. Switch to a build-capable agent for implementation.
4. Inspect the diff and test results before accepting the change.

The distinction is a control boundary, not extra context capacity. Agent definitions, permissions, and model assignments are documented in the official [agents guide](https://opencode.ai/docs/agents/).

## Attach files deliberately

Start with the smallest useful set: the failing test, the implementation it covers, and the nearest instructions. Let repository search reveal imports and callers. This is usually more reliable than preloading a large directory whose irrelevant content competes for attention.

For a bug, include the observed error and exact reproduction command. For a feature, include acceptance criteria and the public interface. For a review, ask for findings only so the agent does not silently turn diagnosis into implementation.

## Context compaction and session boundaries

Long sessions eventually accumulate superseded plans, noisy command output, and repeated file contents. OpenCode can compact session history, but a summary cannot preserve every detail.

Before compaction, capture durable decisions in the repository or a short handoff note. Start a new session when the objective changes materially. A clean session with precise instructions is often better than carrying unrelated history forward.

## Model and provider selection

OpenCode supports multiple providers, but portability is not automatic. Models differ in tool use, context limits, latency, and pricing. Provider policies determine where prompts and code are processed and retained.

Configure providers according to the official [provider guide](https://opencode.ai/docs/providers/) and select models using the [model guide](https://opencode.ai/docs/models/). Confirm current identifiers with the client rather than copying a dated model name from a blog post.

For sensitive repositories, a local provider can reduce external transmission, but you still need to review local logs, MCP servers, shell access, and any remote dependencies. “Local model” does not make every connected tool local.

## MCP without context overload

MCP servers let OpenCode call external systems. Every enabled server can add tool descriptions to the agent's working context and expands what the agent can do.

Enable only the servers required for the task. Prefer read-only or narrowly scoped credentials, and separate production access from development. Test a server independently before asking an agent to depend on it. The current configuration formats are in OpenCode's [MCP server documentation](https://opencode.ai/docs/mcp-servers/).

## Troubleshooting checklist

If OpenCode appears to ignore context:

1. Confirm the project configuration file is valid against the current schema.
2. Check which instruction file applies in the working directory.
3. Verify that the intended agent and model are active.
4. Make the acceptance criteria explicit in the prompt.
5. Attach the smallest decisive file or error output directly.
6. Disable unrelated MCP servers and retry in a fresh session.
7. Confirm that the provider exposes the configured model identifier.

If an agent repeatedly edits the wrong area, add a concrete boundary such as “Only modify `packages/api`; treat generated clients as read-only.” If it repeatedly runs the wrong command, put the canonical command in project instructions and remove contradictory documentation.

## Recommended project setup

A maintainable OpenCode-enabled repository has:

- a concise, version-controlled `AGENTS.md`;
- current build and test commands;
- scoped instructions near specialized packages when needed;
- an `opencode.jsonc` only for settings the project truly shares;
- least-privilege tools and credentials;
- automated checks that independently validate agent output.

The strongest context strategy is not maximum input. It is a small set of authoritative instructions, a well-bounded task, and verification that does not depend on the model's confidence.
