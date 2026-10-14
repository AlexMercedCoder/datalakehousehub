---
title: "What is Tool Calling?"
meta_title: "What is Tool Calling? | Expert Data Lakehouse & AI Glossary"
description: "Tool calling is an LLM capability where the model requests external functions or APIs and uses the results, with notes on agent loops, ReAct, and governance."
---

## What is Tool Calling?

Tool calling (also called function calling) is the capability that lets a language model request that an application run an external function, API, or database query, and then use the result in its response. 

The model does not execute anything itself. The developer describes the available tools (a name, a description, and a JSON Schema for the parameters). When the model decides a tool is needed, it returns a structured request naming the tool and its arguments. The application runs the tool, sends the result back to the model, and the model continues. **Tool Calling** is what lets AI agents query live data, such as running SQL against a lakehouse, instead of answering only from training data.

## Core Architecture and Mechanics

Tool calling works through a few core behaviors:

* **The model chooses when to call a tool.** Based on the user's request and the tool descriptions, it decides whether to answer directly or request one or more tool calls, and agents repeat this loop over several steps.
* **Tool definitions and results consume context.** Every tool description and every result returned to the model takes up space in the context window, so large result sets are usually summarized or paginated.
* **Standard protocols make tools reusable.** The Model Context Protocol (MCP), introduced by Anthropic in 2024, defines a common way for servers to expose tools that many AI clients can call, so a tool does not need to be rebuilt for each model provider or framework.

In a data platform, typical tools include SQL execution against [Apache Iceberg](/apache-iceberg/) tables, catalog and metadata lookups, dbt model documentation, and vector search for unstructured documents.

## Why Tool Calling Matters in the Modern Data Stack

Tool calling is the step that turns a chatbot into an agent that can carry out multi-step analytical work: looking up a schema, running a query, checking the result, and retrying when a query fails.

For data teams, the quality of the tools matters as much as the model. Well-described tools that run against governed views or a semantic layer give agents accurate context, while broad tools with direct access to raw tables make wrong or unsafe actions more likely.

### Key Benefits
- **Fresh answers:** The model can work with live data instead of relying only on what it learned in training.
- **Deterministic work stays in code:** Calculations, queries, and API calls run in ordinary software, where results are exact and repeatable.
- **Auditability:** Each tool call is a structured request that can be logged, reviewed, and limited by permissions.

## Frequently Asked Questions

### What does 'Tool Calling' mean for an AI?
It means the AI can recognize when it lacks information and request that the application run a Python script, SQL query, or API call to fetch the necessary data before continuing. The application, not the model, actually executes the call.

### What is the ReAct framework?
ReAct stands for Reason and Act; it is a prompting approach, introduced in a 2022 research paper, in which the model alternates between writing out its reasoning and taking an external action, then uses each action's result to plan the next step. Many agent frameworks build on this pattern.

### How does Tool Calling impact data governance and security?
Tool calling creates a clear control point. Tools should run with the end user's permissions (or a narrowly scoped service identity), enforce role-based access controls (RBAC) on the data they touch, log every call, and require human approval for actions that change data. Content returned by tools can also contain injected instructions, so applications should treat tool output as data.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
