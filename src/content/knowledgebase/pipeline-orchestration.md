---
title: "Pipeline Orchestration for the Lakehouse: Airflow, Dagster, Prefect, and Event Triggers"
meta_title: "Pipeline Orchestration: Airflow vs Dagster for Lakehouses"
description: "Pipeline orchestration schedules and coordinates the steps of a data pipeline. See what it does for Iceberg tables and how Airflow, Dagster, and Prefect differ."
---

## What is Pipeline Orchestration?

Pipeline orchestration is the coordination of the steps in a data pipeline: deciding when each step runs, in what order, with what inputs, and what happens when one fails. An orchestrator handles scheduling, dependencies between tasks (usually as a [directed acyclic graph](/knowledgebase/directed-acyclic-graph/)), retries, backfills of past periods, alerting, and a record of every run.

The orchestrator does not process data itself. It tells Spark, Dremio, dbt, Flink, or a Python script to do the work, then tracks whether that work succeeded.

## What an Orchestrator Does in an Iceberg Lakehouse

On an [Apache Iceberg](/knowledgebase/apache-iceberg/) lakehouse, the unit that matters is a table snapshot, not a task. A good orchestration setup reflects that:

* **Ingest and transform:** land raw data in a bronze table, run dbt or SQL to build silver and gold tables (see [medallion architecture](/knowledgebase/medallion-architecture/)).
* **Write-audit-publish:** write to an Iceberg branch, run quality checks, and fast-forward `main` only if they pass (see [write-audit-publish](/knowledgebase/write-audit-publish/)).
* **Table maintenance:** schedule compaction, snapshot expiration, and orphan file cleanup, which no engine does for you unless the catalog or platform automates it.
* **Incremental reads:** record the last snapshot ID processed so the next run reads only what changed.

## Comparing the Main Options

| | Apache Airflow 3 | Dagster | Prefect 3 | Event-driven triggers |
|---|---|---|---|---|
| Core model | DAGs of tasks, plus assets | Software-defined assets | Python flows and tasks, plus events | Catalog, storage, or stream events start jobs |
| Lakehouse fit | Broad provider ecosystem for every engine | Assets map naturally to tables | Dynamic, operational pipelines | Low-latency reactions to new snapshots or files |
| License | Apache 2.0 (ASF project) | Apache 2.0, plus Dagster+ | Apache 2.0, plus Prefect Cloud | Depends on the tools |
| Watch out for | Scheduler and worker operations | Everything must become an asset | Lighter lineage model | No central run history unless you add one |

Two changes shape the 2026 picture. Airflow 3.0 shipped in April 2025 with asset-based scheduling and a reworked architecture. In July 2026, Prefect announced it is acquiring Dagster Labs, with both products continuing under their own names and licenses.

## A Concrete Example

A nightly orders pipeline: an ingestion job lands the day's orders in `bronze.orders`; dbt builds `silver.orders` and `gold.daily_revenue` on a WAP branch; a quality check confirms no null order IDs and revenue within expected bounds; the branch is published; a maintenance task compacts small files in `bronze.orders`. In Dagster each table is an asset; in Airflow each step is a task that emits an asset event; in Prefect it is one flow with five tasks. All three can drive the same engines.

For the full comparison, read [Orchestration in 2026: Airflow 3 vs Dagster vs Prefect vs Event-Driven](/blog/orchestration-in-2026/) and [Scheduling and Workflow Orchestration](/blog/2025-05-intro-to-data-engineering-concepts-12/). Tool pages: [Apache Airflow](/knowledgebase/apache-airflow/), [Dagster](/knowledgebase/dagster/), [Prefect](/knowledgebase/prefect/).

## Frequently Asked Questions

### Is orchestration the same as ETL?
No. [ETL](/knowledgebase/etl/) is the work of moving and transforming data. Orchestration decides when that work runs and in what order.

### Do streaming pipelines need an orchestrator?
A continuously running Flink or Kafka Connect job does not need a scheduler, but the batch work around it (compaction, snapshot expiration, downstream aggregates) usually does.

### Can the catalog replace the orchestrator?
Partly. Some catalogs and platforms automate table maintenance and emit commit events that trigger downstream jobs. Multi-step business pipelines still benefit from an orchestrator's run history and retries.

---

### E-E-A-T & Further Reading
