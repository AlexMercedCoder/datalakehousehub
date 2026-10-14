---
title: "Idempotency in Data Pipelines: Safe Retries on Apache Iceberg Tables"
meta_title: "Idempotency in Data Pipelines and Iceberg Tables | Glossary"
description: "Idempotency means running a pipeline twice gives the same result as running it once. See how MERGE, overwrites, and Iceberg snapshots make retries safe."
---

An operation is idempotent if running it several times produces the same result as running it once. In data engineering, an idempotent pipeline can be retried or rerun for the same input window without creating duplicates or drifting totals.

Failures are routine: APIs time out, clusters lose nodes, and commits conflict. Orchestrators such as [Apache Airflow](/knowledgebase/apache-airflow/) and [Dagster](/knowledgebase/dagster/) respond by retrying tasks. If the task is not idempotent, every retry can add another copy of the data.

## What a Non-Idempotent Pipeline Looks Like

A job computes daily sales and appends the result:

`INSERT INTO daily_sales (sale_date, total) VALUES ('2026-05-14', 50000);`

The insert succeeds at 2:00 AM, but a network timeout hides the success from the orchestrator. It retries at 2:15 AM and the same row is inserted again. The next morning the dashboard sums two rows and reports $100,000 instead of $50,000.

## Patterns for Idempotent Writes

### MERGE INTO (Upsert)
Instead of appending, the pipeline matches incoming rows to existing rows on a business key, such as `transaction_id`, and updates matches while inserting new rows. Running it again with the same input rewrites the same rows instead of adding new ones. Iceberg, Delta Lake, and Hudi all support `MERGE INTO`. Note that table formats do not enforce primary keys, so the key lives in your `ON` clause, and the source must not contain duplicate keys or the merge fails or produces ambiguous results. Deduplicate the batch first.

### Overwrite by Partition or Window
For batch jobs that recompute a whole day or month, replacing that slice is cheaper than row-by-row merges. In Spark with Iceberg, `INSERT OVERWRITE` in dynamic mode replaces only the partitions present in the new data, and the DataFrame API offers `overwritePartitions()`. You can also use `overwrite` with an explicit filter such as `sale_date = '2026-05-14'`. The delete and the insert land in one atomic snapshot, so a retry replaces the slice again and readers never see a half-written state. Avoid the older pattern of dropping a directory and then writing files in two separate steps, because a crash between them leaves a gap.

### Deterministic Inputs from the Orchestrator
An idempotent task reads a fixed window instead of "yesterday" from the server clock. Airflow passes each run its `logical_date` and data interval (`data_interval_start`, `data_interval_end`); the older `execution_date` name was deprecated and removed in Airflow 3. Bound queries by those values and a backfill of three years of history is just three years of reruns with no code changes. See [backfilling data](/knowledgebase/backfilling-data/).

## Comparing the Techniques

| Technique | Retry safe? | Cost | Best for |
|---|---|---|---|
| Plain `INSERT` / append | No | Lowest | Immutable event logs with downstream dedupe |
| `MERGE INTO` on a business key | Yes, if the source batch is deduplicated | Higher, reads and rewrites matched files | CDC, late-arriving updates |
| Partition or window overwrite | Yes | Rewrites the whole slice | Daily or monthly recomputes |
| Write-audit-publish on a branch | Yes, publish is one atomic step | Extra branch management | Pipelines with quality gates |

## How Iceberg Snapshots Help

Every [Apache Iceberg](/knowledgebase/apache-iceberg/) commit creates a new [snapshot](/knowledgebase/iceberg-snapshot/), and a commit either lands fully or not at all. That gives you two extra safety nets. You can store a batch or run ID in snapshot summary properties and skip a commit whose ID already exists, and if a bad run does get through, you can roll the table back to the prior snapshot. The [write-audit-publish](/knowledgebase/write-audit-publish/) pattern adds a branch so data is validated before it becomes visible.

For worked examples, read [Idempotent Pipelines: Build Once, Run Safely Forever](/blog/2026-02-de-best-practices-04-idempotent-pipelines/) and [Designing Idempotent Pipelines in the Agentic Lakehouse](/blog/idempotent-pipelines-agentic-lakehouse-double-write-anomalies/). The [idempotent pipelines](/knowledgebase/idempotent-pipelines/) glossary entry covers the pipeline design side.

## Summary

Idempotency turns retries from a risk into a routine. Use merges on business keys, atomic overwrites of fixed windows, and orchestrator-provided time bounds, and let the table format's atomic commits do the rest.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
