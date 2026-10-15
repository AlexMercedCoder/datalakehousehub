---
title: "Project Nessie: Git-Like Branches for Iceberg and How It Compares to Polaris"
meta_title: "Project Nessie Iceberg Catalog vs Apache Polaris | Glossary"
description: "Project Nessie is an open source Iceberg catalog with Git-like branches, tags, and multi-table commits. See how it works and how it compares to Apache Polaris."
canonical: "https://iceberglakehouse.com/iceberg/project-nessie/"
---

Project Nessie is an open source transactional catalog for [Apache Iceberg](/knowledgebase/apache-iceberg/) tables that adds Git-like version control to a [data lakehouse](/knowledgebase/data-lakehouse/). It tracks the state of many tables as a series of commits, so teams can create branches and tags, isolate changes, and publish updates to several tables at once.

Without catalog-level branching, testing a pipeline change safely often means copying production data into a separate environment, running the test, and then overwriting production tables. Nessie avoids the copy: a branch points at the same data and metadata files as `main` until something is written to it.

## How Nessie Works

Nessie does not store data files or Iceberg manifests. For each table on each branch, it stores a pointer to the table's current metadata file, and it records every change as a commit.

### Commits
Each change made through Nessie, such as an engine like Apache Spark, Apache Flink, Trino, or Dremio committing new data to an Iceberg table, becomes a commit identified by a hash. The commit history is append-only, like Git's.

### Branches and Isolation
An engineer can create a branch from `main` as a metadata operation; no data is copied. A Spark job can then write to the branch while analysts querying `main` keep seeing the previous state, with no partial results from the in-progress job.

### Multi-Table Commits and Merging
Iceberg on its own commits one table at a time. If a pipeline updates `Customers`, `Orders`, and `Inventory`, a failure halfway through can leave them out of sync. With Nessie, the pipeline writes all three on a branch, then merges the branch into `main`. The merge publishes the changes to all three tables in one atomic commit. If `main` has conflicting changes to the same tables, the merge fails and production is left unchanged.

## The Write-Audit-Publish Pattern

Branching makes the [Write-Audit-Publish](/knowledgebase/write-audit-publish/) (WAP) pattern straightforward:

1. **Write:** An orchestrator such as Apache Airflow creates a branch (for example `etl_nightly_batch`) and runs the ingestion job against it.
2. **Audit:** Data quality checks from tools such as dbt tests or Soda run against the branch, checking for nulls, out-of-range values, and duplicate keys.
3. **Publish:** If the checks pass, the orchestrator merges the branch into `main`. If they fail, the branch is dropped and production is untouched.

Iceberg also supports branches and tags at the level of a single table, which can be used for WAP without Nessie. Nessie's difference is that its branches cover the whole catalog. For a step-by-step guide, read [Write-Audit-Publish with Apache Iceberg Branches](/blog/write-audit-publish-iceberg-branches/).

## Querying Branches in Dremio

Dremio can connect to Nessie as a source and supports branch-aware SQL:

```sql
-- Query production
SELECT * FROM sales_data AT BRANCH main;

-- Query an experimental branch
SELECT * FROM sales_data AT BRANCH q3_revenue_experiment;
```

Dremio's earlier managed catalog, Arctic, was built on Nessie. Dremio's current catalog, Dremio Catalog, is built on [Apache Polaris](/knowledgebase/apache-polaris/), and Dremio contributed Nessie's ideas and capabilities to the Polaris effort. Nessie remains available as its own open source project and can also be reached through the Iceberg REST interface.

## Nessie vs Other Iceberg Catalogs

| | Project Nessie | Apache Polaris | AWS Glue Data Catalog |
|---|---|---|---|
| Governance | Open source project (Apache 2.0) | Apache Software Foundation project | AWS managed service |
| Iceberg REST API | Yes | Yes | Yes |
| Catalog-wide branches and tags | Yes | No; uses Iceberg table-level branches | No; uses Iceberg table-level branches |
| Multi-table atomic commits | Yes, through branch merges | Through the REST multi-table commit endpoint where supported | Not documented |
| Access control | Basic authorization rules; S3 assume-role credentials and request signing | Role-based access control and credential vending | AWS IAM and Lake Formation |

For help choosing a catalog, read [Choosing the Right Iceberg Control Plane: Polaris vs. Unity Catalog vs. Cloud REST](/blog/2026-05-choosing-iceberg-control-plane/), and to try Nessie locally, see [Hands-on with Apache Iceberg on Your Laptop](/blog/2024-9-hands-on-iceberg-dremio-minio-nessie/).

## Summary of Technical Value

Project Nessie brings commits, branches, tags, and multi-table merges to Iceberg catalogs. It makes zero-copy experimentation and Write-Audit-Publish across many tables practical. Teams that mostly need governance, access control, and broad engine support often choose Apache Polaris instead, while teams that need catalog-wide branching still have a clear reason to run Nessie.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
