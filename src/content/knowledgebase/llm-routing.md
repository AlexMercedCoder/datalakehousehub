---
title: "What is LLM Routing?"
meta_title: "What is LLM Routing? | Expert Data Lakehouse & AI Glossary"
description: "LLM routing is the practice of sending each request to the language model best suited for it, balancing answer quality, latency, and cost across several models."
---

LLM routing is the practice of deciding, for each incoming request, which large language model should answer it. Instead of sending every prompt to one model, a router inspects the request and picks among several candidates, usually trading answer quality against cost and latency. A short lookup question might go to a small, cheap model, while a multi-step SQL generation task goes to a larger one. The router can be a set of rules, a classifier, or a learned model trained to predict which candidate will answer well enough.

## How It Works

A routing layer sits between the application and the model providers, often inside an AI gateway. For each request it typically:

1. **Extracts signals** from the request: prompt length, task type, the tools requested, the user or tenant, or an embedding of the prompt.
2. **Scores candidate models** using rules ("anything that calls tools goes to model A"), a trained classifier, or similarity to past requests whose best model is known.
3. **Dispatches** the request to the chosen model, and may fall back to another model if the first one errors, times out, or returns a low-confidence answer.
4. **Logs the decision** with cost, latency, and outcome so the routing policy can be tuned.

Research has formalized the learned version. The RouteLLM paper (Ong et al., 2024) trains routers on human preference data to choose between a stronger, more expensive model and a weaker, cheaper one, and reports cost reductions of more than 2x in some cases without degrading response quality.

| Approach | How it decides | Strength | Weakness |
|---|---|---|---|
| Static rules | Task type, tenant, or tool use | Predictable, easy to audit | Misses nuance within a task type |
| Classifier router | Model predicts difficulty or best candidate | Adapts per prompt | Needs labeled or preference data |
| Cascade | Try cheap model first, escalate on low confidence | Pays for the large model only when needed | Adds latency on escalated requests |
| Fallback only | Primary model, backup on failure | Improves availability | Does not reduce cost |

LLM routing is related to but different from a [mixture of experts](/knowledgebase/mixture-of-experts-moe/), where routing happens inside one model's layers. LLM routing chooses between whole, separately deployed models.

## LLM Routing in the Lakehouse

Analytics agents that answer questions over lakehouse data make many model calls per question: planning, schema lookup, SQL generation, result summarization. Not every step needs the same model. Routing lets a team send cheap steps to small models and reserve the largest model for SQL generation against a [semantic layer](/knowledgebase/semantic-layer/), where mistakes are costly.

The routing logs themselves are useful data. Writing each decision, its token cost, and its outcome to an [Apache Iceberg](/knowledgebase/apache-iceberg/) table lets teams query routing performance with Dremio, Trino, Spark, or DuckDB, compare models over time, and feed the results back into the router. Pairing routing with [semantic caching](/knowledgebase/semantic-caching/) reduces cost further, since repeated questions never reach a model at all.

The Hub covers the cost side in [Budgeting for Agentic Analytics When Every Question Costs Something Different](/blog/agentic-analytics-tco-token-budgets/) and the governance side in [Governing What Agents Cost You](/blog/agent-cost-governance/).

## Summary

LLM routing picks the right model for each request using rules, classifiers, or cascades, so applications pay for large models only where they matter. For agentic analytics on a lakehouse, it is one of the main levers for keeping per-question cost predictable.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
