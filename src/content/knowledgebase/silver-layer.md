---
title: "Silver Layer: The Cleaned, Conformed Tier of the Medallion Architecture"
meta_title: "Silver Layer in Medallion Architecture: Iceberg Examples"
description: "The silver layer is the medallion tier where raw bronze data is cleaned, deduplicated, and conformed. See what belongs there and how to build it on Iceberg."
---

## What is the Silver Layer?

The silver layer is the middle tier of the [medallion architecture](/knowledgebase/medallion-architecture/). It holds data that has been cleaned, deduplicated, typed, and conformed, but not yet shaped into business-specific aggregates. [Bronze](/knowledgebase/bronze-layer/) keeps raw data as it arrived; silver makes it trustworthy; [gold](/knowledgebase/gold-layer/) shapes it for specific reports, metrics, and applications.

Databricks popularized the bronze, silver, and gold naming, but the idea is older than the label: raw staging, an integrated "clean" layer, and presentation marts have been part of warehouse design for decades. On a lakehouse, each tier is usually a set of [Apache Iceberg](/knowledgebase/apache-iceberg/) tables in an open catalog, so any engine can read any tier.

## What Happens in the Silver Layer

Common silver transformations:

* **Type and format fixes.** Strings become dates and decimals, time zones are normalized, currencies and units are made consistent.
* **Deduplication.** Repeated events from at-least-once ingestion or replayed CDC are collapsed using a business key and an event timestamp.
* **Conformance.** The same customer from the CRM and the billing system gets one key, and codes are mapped to shared reference values.
* **Validation.** Rows that fail quality rules are dropped, flagged, or routed to a quarantine table instead of flowing to gold.
* **History handling.** Changes are applied with `MERGE`, and some teams keep history here using [slowly changing dimensions](/knowledgebase/slowly-changing-dimensions/) Type 2.

Silver tables generally stay close to the source grain (one row per order, per event, per customer version). Star schemas, wide denormalized tables, and aggregates usually belong in gold.

## Bronze vs Silver vs Gold at a Glance

| | Bronze | Silver | Gold |
|---|---|---|---|
| Purpose | Land raw data, replayable | Clean, conformed, trustworthy | Business-ready for a use case |
| Grain | As received | Source grain, deduplicated | Aggregated or modeled (star schema) |
| Typical consumers | Data engineers | Engineers, analysts, data scientists | BI tools, semantic layers, AI agents |
| Typical Iceberg ops | Append | `MERGE INTO`, upserts, deletes | Rebuilds, incremental aggregates |
| Quality gate | Schema capture | Quality rules, quarantine | Metric and reconciliation checks |

## Building a Silver Layer on Iceberg

A typical pattern: ingestion appends to a bronze Iceberg table; a scheduled Spark, Flink, dbt, or Dremio job runs a `MERGE INTO silver.orders` that deduplicates on `order_id` and keeps the latest version; [data quality](/knowledgebase/data-quality/) checks run before the change is exposed, often with [Write-Audit-Publish](/knowledgebase/write-audit-publish/) on an Iceberg branch. Frequent merges create small files and delete files, so silver tables need regular compaction and snapshot expiration.

Some teams skip physical silver tables for simple sources and define silver as SQL views over bronze, materializing only when query cost or latency demands it. Engines with view and reflection or materialized view support make that trade cheap to revisit.

For a fuller walkthrough, see [What is Three-Tier Data (Bronze, Silver, Gold)](/blog/2024-10-bronze-silver-gold-data/) and [Data Quality Is a Pipeline Problem, Not a Dashboard Problem](/blog/2026-02-de-best-practices-03-data-quality-first/).

## Frequently Asked Questions

### Is the silver layer required?
No. Medallion is a convention, not a standard. Small teams sometimes go straight from raw to modeled tables. Silver earns its place when several gold products depend on the same cleaned entities.

### Should silver data be exposed to analysts?
Often, yes. Silver is the right place for exploratory work that needs row-level detail without raw-data mess. Access controls and column masking should already apply here, since silver usually still contains personal data.

### Where do slowly changing dimensions belong?
Either silver or gold. Keeping full history in silver lets several gold models reuse it; building SCDs in gold keeps silver simpler. Pick one and apply it consistently.

---

### E-E-A-T & Further Reading
