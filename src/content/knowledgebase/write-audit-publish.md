---
title: "Write-Audit-Publish (WAP): Staging, Testing, and Publishing Data with Iceberg Branches"
meta_title: "Write-Audit-Publish (WAP) with Iceberg Branches | Glossary"
description: "Write-Audit-Publish (WAP) is a pattern that stages new data, tests it, and only then exposes it. Here is how Iceberg branches and Nessie make WAP cheap."
---

## What is the Write-Audit-Publish (WAP) Pattern?

Write-Audit-Publish (WAP) is a data engineering pattern that keeps new data out of production until it passes quality checks. It borrows from software CI/CD: changes land somewhere isolated, get tested, and are promoted only when the tests pass.

The pattern exists because of a common failure mode. A nightly ETL job pulls from a third-party API and writes straight into the production `sales_fact` table. If the API silently switches from dollars to cents, the job still succeeds, and the bad numbers show up on the morning dashboard. Readers lose trust long before anyone finds the root cause.

WAP fixes this by inserting a staging step and a quality gate between the pipeline and the tables people query.

## The Three Phases of WAP

An orchestrator such as Apache Airflow or Dagster usually runs the three phases in order.

### 1. Write (Isolated Staging)
The pipeline does not write to the production table. It writes to an isolated location that readers of production cannot see.

In a traditional warehouse this is a separate staging table (`staging_sales_fact`). In a [data lakehouse](/knowledgebase/data-lakehouse/) built on [Apache Iceberg](/knowledgebase/apache-iceberg/), it can be a branch. Iceberg supports table-level branches, and [Project Nessie](/knowledgebase/project-nessie/) adds Git-like branches across a whole catalog. The pipeline writes to the branch while `main` stays unchanged for business users.

### 2. Audit (The Quality Gate)
With the write finished, the orchestrator runs data quality checks against the staged data, using a framework such as [Great Expectations](/knowledgebase/great-expectations/), [Soda](/knowledgebase/soda/), or [dbt](/knowledgebase/dbt/) tests. Typical checks:
* `max(revenue) < 10000000` to catch outliers or unit changes.
* `count(*) where customer_id is null = 0` to catch missing keys.
* `row_count > historical_average * 0.8` to catch partial API payloads.

If a critical check fails, the orchestrator stops the pipeline and alerts the team. Because the data only exists on the branch or staging table, production is unaffected, and the branch can be dropped or fixed.

### 3. Publish (Atomic Promotion)
Only when the checks pass does the orchestrator publish. In a staging-table setup that means an `INSERT` or swap into the production table. With Iceberg table branches, `main` is fast-forwarded to the audited branch's snapshot. With Nessie, the branch is merged into `main`, which can publish changes to several tables in one commit. Readers see the new data all at once, and only data that passed the checks you wrote.

## WAP Options on the Lakehouse Compared

| Approach | Isolation scope | How you write | How you publish | Notes |
|---|---|---|---|---|
| Staging table | One table | Write to a copy of the table | `INSERT`/swap into production | Works anywhere; doubles the write and storage for that batch |
| Iceberg table branch | One table | Set `write.wap.enabled=true` and `spark.wap.branch` in Spark | `fast_forward` procedure moves `main` to the branch head | No data copy; branch is a metadata pointer |
| Iceberg WAP ID (staged snapshot) | One table | Set `spark.wap.id`; snapshot is staged, not current | `cherrypick_snapshot` | Older mechanism, still supported |
| Nessie catalog branch | Many tables | Create a branch, point the engine at it | Merge branch into `main` | Multi-table publish in one commit |

The choice usually comes down to scope. If a pipeline only touches one table, an Iceberg table branch is enough. If a job updates a fact table and several dimensions that must change together, a catalog-level branch avoids a window where some tables are updated and others are not.

## Implementing WAP at Scale

Staging tables used to mean copying large amounts of data. Iceberg changes that because a table is defined by metadata that points to data files. Writing to a branch creates new data files once plus a small amount of metadata. Publishing moves a pointer; the Parquet files are not rewritten or copied. Failed branches leave behind files that snapshot expiration and orphan file cleanup remove later.

For a step-by-step walkthrough with Spark SQL, see [Write-Audit-Publish with Apache Iceberg Branches](/blog/write-audit-publish-iceberg-branches/). For choosing the testing layer, see [Data Quality Tooling Compared](/blog/data-quality-tooling-compared/), and for merging many branches in busy pipelines, see [High-Throughput Branch Merging](/blog/multi-branch-iceberg-merge-automation/).

## Summary

WAP keeps unverified data away from consumers by staging writes, testing them, and publishing only what passes. On an Iceberg lakehouse, branches make the staging step nearly free in storage terms, which turns WAP from an expensive special case into a reasonable default for important tables.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
