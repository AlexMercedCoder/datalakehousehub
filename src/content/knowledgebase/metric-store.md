---
title: "What is Metric Store?"
meta_title: "What is Metric Store? | Expert Data Lakehouse & AI Glossary"
description: "A metric store is a central layer that defines business metrics and KPI logic once, so every BI tool and AI app reports the same numbers from one calculation."
---

## What is Metric Store?

A metric store is a central place to define business metrics, such as revenue or churn, once and serve them to every downstream BI tool, notebook, and application. 

Without a **Metric Store**, each dashboard or report tends to carry its own copy of a metric's SQL, and the copies drift apart. A metric store, usually part of a [semantic layer](/knowledgebase/semantic-layer/), keeps the definition in one governed place and generates the query for whichever tool asks for it.

## Core Architecture and Mechanics

A metric store typically does three things:

* **Maps physical tables to business-friendly terms and dimensional models.** Users ask for a metric by name and slice it by dimensions, without needing to know the table joins behind it.
* **Keeps calculations consistent (like 'Annual Recurring Revenue') across downstream dashboards and AI tools.** Every consumer gets the same formula, filters, and time logic.
* **Often caches or pre-aggregates common queries to speed up dashboards.** Some implementations use materialized aggregates or engine-level acceleration such as Dremio Reflections.

Metric stores commonly sit on top of warehouse or lakehouse tables, such as [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, and are defined alongside transformation tools like dbt.

## Why Metric Store Matters in the Modern Data Stack

By introducing a semantic layer, organizations get a shared definition for each metric. It reduces the chance of different departments from arriving at conflicting numbers simply because they queried different tables or wrote different SQL logic.

For organizations with many teams, a metric store reduces duplicated work. A metric change is made once and reaches every consumer, instead of being repeated in each dashboard. It also gives AI agents a named, documented set of metrics to query instead of raw tables.

### Key Benefits
- **Consistency:** One definition per metric across tools.
- **Tool Flexibility:** Metrics live outside any single BI tool, so changing tools does not mean rewriting logic.
- **Traceability:** Metric definitions document which tables and columns each number comes from.

## Frequently Asked Questions

### How does this differ from traditional BI?
Traditional BI locks the business logic inside the specific dashboard tool (like Tableau). A semantic layer sits *before* the BI tool, allowing any application to access the same logic. This matters most when an organization uses more than one BI tool or wants AI tools to use the same definitions.

### Is dbt considered a semantic layer?
dbt is primarily a transformation tool, but the dbt Semantic Layer, powered by MetricFlow, lets teams define metrics and entities alongside the transformation code.

### How does Metric Store impact data governance and security?
It gives governance a single place to act. Access rules and documentation can be attached to metrics, and audit logs show who queried what, though the exact controls depend on the product.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
