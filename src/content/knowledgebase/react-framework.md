---
title: "What is ReAct Framework?"
meta_title: "What is ReAct Framework? | Expert Data Lakehouse & AI Glossary"
description: "ReAct (Reason and Act) is a prompting pattern where an AI agent alternates reasoning steps with tool calls. See how it lets agents run multi-step data analysis."
---

ReAct (short for Reasoning and Acting) is a prompting pattern for large language models in which the model alternates between writing out a reasoning step and taking an action, such as calling a search API or running a query, then reads the result before deciding what to do next. It was introduced in the paper "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., first posted October 2022 and published at ICLR 2023). ReAct is not a software library; it is a loop structure that many agent frameworks implement. It is unrelated to the React JavaScript UI library.

## How It Works

A ReAct agent runs a loop until it reaches an answer or a step limit:

1. **Thought:** the model writes a short reasoning step about what it knows and what it needs next.
2. **Action:** the model emits a structured call to one of its available tools, for example `search("Apache Polaris graduation")` or `run_sql("SELECT ...")`.
3. **Observation:** the application executes the tool and appends the result to the prompt.
4. The model writes the next Thought based on the new observation, and the cycle repeats.

The paper tested this on question answering (HotpotQA), fact verification (FEVER), and interactive decision-making tasks (ALFWorld and WebShop). On the knowledge tasks, letting the model look facts up through a simple Wikipedia API reduced the hallucination and error propagation seen with pure [chain-of-thought](/knowledgebase/chain-of-thought/) reasoning, and the interleaved traces made the model's behavior easier for people to inspect.

| Approach | Reasons in text | Uses external tools | Main weakness |
|---|---|---|---|
| Chain-of-thought | Yes | No | Can reason confidently from wrong facts |
| Action-only agent | No | Yes | Hard to follow or debug its choices |
| ReAct | Yes, between actions | Yes | More model calls, longer prompts |

Modern models expose native [tool calling](/knowledgebase/tool-calling/), so the Action step is usually a structured function call rather than parsed text, but the reason-act-observe loop is the same. Most [agentic frameworks](/knowledgebase/agentic-frameworks/), including [LangChain](/knowledgebase/langchain/) and [LlamaIndex](/knowledgebase/llamaindex/), ship a ReAct-style agent.

## ReAct in the Lakehouse

The pattern fits analytics well, because answering a business question is rarely one query. An agent connected to a lakehouse through tools (often exposed over MCP) might:

* Think that it needs to find where revenue data lives, then search the catalog.
* Observe that a `gold.revenue_daily` view exists, then read its schema and the [semantic layer](/knowledgebase/semantic-layer/) definition of revenue.
* Write SQL against that view, run it on an engine such as Dremio, Trino, or DuckDB over [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, and observe the result.
* Notice a gap in the data, run a follow-up query, and then answer.

Each observation grounds the next step in real metadata and query results instead of the model's guesses. The reasoning trace also serves as an audit record of how an answer was produced, which matters for governed analytics. The tradeoffs are cost and latency, since every loop is another model call, and safety, since an agent that can act needs scoped permissions and step limits.

The Hub covers the agent side in [What Are AI Agents](/blog/2025-04-what-are-ai-agents/) and [AI Agent Frameworks: Benefits and Limitations](/blog/2025-04-ai-agent-frameworks/), and connecting agents to data in [Tools in MCP](/blog/2025-04-tools-in-mcp/).

## Summary

ReAct interleaves reasoning steps with tool actions and observations, so a model can gather facts as it goes rather than answering from memory alone. It is the basic loop behind most data agents that explore a catalog, run queries, and refine their answers.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
