---
title: "What is Idempotent Pipelines?"
meta_title: "What is Idempotent Pipelines? | Expert Data Lakehouse & AI Glossary"
description: "An idempotent pipeline is a data workflow that gives the same result however many times it runs on the same input, so retries and reruns do not duplicate data."
---

An idempotent pipeline is a data pipeline that produces the same end state no matter how many times it runs against the same input. If a job fails halfway and the orchestrator retries it, or an engineer reruns last Tuesday's load to fix a bug, the target tables end up identical to a single clean run: no duplicate rows, no double-counted revenue, no half-written partitions. The idea comes from [idempotency](/knowledgebase/idempotency/) in mathematics and API design, applied to batch and streaming data movement.

## Why Pipelines Need It

Distributed jobs fail in ordinary ways: a spot instance is reclaimed, a network call times out, a source API returns a 500. Schedulers such as [Apache Airflow](/knowledgebase/apache-airflow/) retry failed tasks, and backfills rerun old date ranges on purpose. A pipeline that blindly appends rows on every run turns each retry into duplicate data. Idempotency moves the safety into the pipeline design, so retries and [backfills](/knowledgebase/backfilling-data/) become routine operations instead of cleanup projects.

## How It Works

Most idempotent pipelines combine a few techniques:

* **Deterministic inputs.** Each run reads a bounded, named slice of the source, such as one date partition or a fixed range of offsets, rather than "whatever is new right now." The run's logical date comes from the scheduler, not from the wall clock.
* **Overwrite instead of append.** The job replaces the output slice it owns. Rerunning the 2026-10-01 load replaces the 2026-10-01 partition rather than adding a second copy.
* **Keyed upserts.** When output rows have a stable business or [natural key](/knowledgebase/natural-key/), a `MERGE` updates matching rows and inserts new ones, so replaying the same records changes nothing. See [upserts](/knowledgebase/upserts-update-and-insert/).
* **Atomic commits.** Output becomes visible all at once or not at all, so a crash mid-write leaves no partial results for readers or for the next retry to trip over.
* **Tracked progress.** Streaming jobs store the offsets or checkpoints they have committed alongside the output, so a restart resumes from the right place.

| Pattern | Rerun behavior | Typical use |
|---|---|---|
| Plain append | Duplicates rows | Rarely safe on its own |
| Partition overwrite | Replaces the run's slice | Daily batch loads, backfills |
| MERGE on a key | Updates or skips existing rows | CDC feeds, dimension tables |
| Append with dedup downstream | Duplicates land, then get removed | Raw Bronze ingestion |

## Idempotent Pipelines in the Lakehouse

Open table formats make these patterns practical on object storage. Every write to an [Apache Iceberg](/knowledgebase/apache-iceberg/) table is an atomic snapshot commit, so a failed job leaves the table at its previous snapshot instead of half-updated. Iceberg's Spark integration supports `MERGE INTO` and `INSERT OVERWRITE`; the Iceberg docs recommend `MERGE INTO` over `INSERT OVERWRITE` because it replaces only affected data files, and recommend dynamic overwrite mode when overwrite is used, so only partitions present in the query output are replaced.

In a [medallion architecture](/knowledgebase/medallion-architecture/), Bronze tables often accept appends for auditability, while Silver and Gold transformations are written as keyed merges or partition overwrites so they can be rebuilt from Bronze at any time. [Write-audit-publish](/knowledgebase/write-audit-publish/) adds another layer: writes land on a branch, get validated, then publish in one step, so a rerun never exposes bad data to engines such as Dremio, Trino, or Spark reading the main branch.

For a deeper walkthrough, read [Idempotent Pipelines: Build Once, Run Safely Forever](/blog/2026-02-de-best-practices-04-idempotent-pipelines/) and [Designing Idempotent Pipelines in the Agentic Lakehouse](/blog/idempotent-pipelines-agentic-lakehouse-double-write-anomalies/), which covers double writes when AI agents retry.

## Summary

An idempotent pipeline can be rerun safely because it reads a defined input, writes by overwrite or keyed merge, and commits atomically. On a lakehouse, Iceberg's snapshot commits and `MERGE INTO` support make that design the default choice rather than an extra feature.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
