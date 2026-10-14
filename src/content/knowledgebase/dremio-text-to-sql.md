---
title: "What is Dremio Text-to-SQL?"
meta_title: "What is Dremio Text-to-SQL? | Expert Data Lakehouse & AI Glossary"
description: "Dremio Text-to-SQL is a Dremio feature that turns natural language questions into SQL, letting business users query lakehouse data without writing code."
---

## What is Dremio Text-to-SQL?

Dremio Text-to-SQL is a Dremio feature that lets users ask questions in natural language and have the platform generate SQL against their data, so they can query datasets without writing code.

In data engineering and analytics, natural language interfaces like **Dremio Text-to-SQL** lower the barrier to querying a lakehouse. Dremio announced text-to-SQL in June 2023, and in current Dremio Cloud releases this capability is part of the built-in AI Agent, which writes and runs SQL based on the user's question and the information in Dremio's semantic layer.

## Core Architecture and Mechanics

To understand the practical application of Dremio Text-to-SQL, it helps to look at how it works:

* **Runs inside the Dremio console as part of the platform.** Users type a question into the chat, and the agent generates SQL, runs it through Dremio's query engine, and can return results as tables or charts.
* **Uses the semantic layer for context.** Wikis (descriptions attached to datasets) and labels (tags such as PII or Finance) help the agent find relevant tables and views and interpret business terms. Better-documented views lead to better SQL.
* **Queries data where it lives.** Dremio queries tables in formats like [Apache Iceberg](/apache-iceberg/) on object storage and federated sources, so users do not need to build copy pipelines before asking questions.

The generated SQL is visible, so users and engineers can review what the agent ran.

## Why Dremio Text-to-SQL Matters in the Modern Data Stack

Text-to-SQL lets business users answer routine questions themselves instead of waiting for an analyst to write a query, which frees data teams to work on modeling and data quality.

For enterprises with decentralized teams, pairing natural language querying with a shared semantic layer helps different users get consistent answers, because the agent works from the same curated views and definitions. Results still depend on how well the semantic layer is documented, and generated SQL can be wrong, so review matters for important decisions.

### Key Benefits
- **Accessibility:** Non-technical users can explore data in plain language.
- **Open data:** Works over open table formats like Iceberg rather than requiring data to be loaded into a proprietary store.
- **Auditability:** Questions, generated SQL, and answers are logged, and the SQL can be inspected in the chat.

## Frequently Asked Questions

### Is this a generalized open-source standard?
No. It is a Dremio product feature. Dremio also offers an open-source MCP server for teams that want to use their own AI client to explore Dremio data and generate SQL.

### Does this require moving data into Dremio?
No. Dremio queries data where it resides, such as Iceberg tables in cloud object storage and connected databases.

### How does Dremio Text-to-SQL impact data governance and security?
The agent only uses data and objects the logged-in user has privileges on, so existing role-based access controls (RBAC) still apply. Dremio's documentation notes that using it requires the CALL MODEL privilege on the configured model provider.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
