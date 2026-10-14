---
title: "What is Data as Code?"
meta_title: "What is Data as Code? | Data Lakehouse Hub Knowledge Base"
description: "Data as Code applies Git-style workflows such as branches, commits, tags, and merges to lakehouse tables, using versioned catalogs like Project Nessie."
---

# What is Data as Code?

## Introduction to Data as Code

Software engineers use version control systems such as Git to manage application code. They create a branch, make and test changes in isolation, commit them, and merge them into the main branch through a reviewed CI/CD process. If a bad change reaches production, they can revert it.

Data pipelines have traditionally lacked those safety nets. An `INSERT`, `UPDATE`, or `MERGE` against a production table changes it immediately. If the pipeline has a logic error, downstream dashboards and models read the bad data until someone notices and repairs it.

**Data as Code** is the practice of applying version control workflows, such as branching, committing, tagging, merging, and reverting, to data itself, so data changes can be developed, tested, and published with the same discipline as code changes.

## How Data as Code Is Implemented

On a lakehouse, Data as Code is usually implemented by a versioned [data catalog](/knowledgebase/data-catalog/) on top of an open table format such as [Apache Iceberg](/knowledgebase/apache-iceberg/).

Iceberg data files are immutable, and each table's state is defined by a metadata file that lists its snapshots. A catalog maps each table name to its current metadata file. A versioned catalog records those mappings for all tables as a history of commits and lets users create named references (branches and tags) to points in that history. Because a branch only points to existing metadata, creating one does not copy any data files.

The main open-source example is **[Project Nessie](/knowledgebase/project-nessie/)**, a transactional catalog with Git-like semantics across all the tables it manages. It supports branches, tags, commits, merges, and multi-table transactions, and it can serve Iceberg clients through the Iceberg REST catalog API. Other tools apply related ideas at different layers. lakeFS versions data at the object storage level across any file format. Iceberg itself supports branches and tags on individual tables, which is useful for single-table workflows but does not coordinate changes across tables.

Dremio built its earlier Arctic catalog service on Nessie. Dremio's current catalog is based on [Apache Polaris](/knowledgebase/apache-polaris/), and Dremio continues to support Nessie as a catalog source.

### 1. Branching
An engineer reworking the pipeline that builds a `gold_sales` table creates a branch instead of testing against production. With Nessie's Spark SQL extensions:

`CREATE BRANCH IF NOT EXISTS dev_sales_overhaul IN nessie FROM main`

Jobs then write to `dev_sales_overhaul`. They can add columns, rewrite data, and insert rows, and none of those changes are visible to users reading `main`.

### 2. Committing and Tagging
Each write on the branch is recorded as a commit. Tags give a name to a specific state of the catalog, for example the data used for a quarter-end report or to train a model:

`CREATE TAG IF NOT EXISTS q3_2026_financials IN nessie FROM main`

A tag lets a team query or reproduce that exact state later, as long as the underlying files are retained by the catalog's garbage collection policy.

### 3. Merging Across Tables
In a traditional data lake, a pipeline that updates five tables does so one at a time. If it fails partway, some tables are updated and others are not, and readers see an inconsistent state.

With a versioned catalog, the pipeline updates all five tables on a branch, and data quality checks (for example with [Great Expectations](/knowledgebase/great-expectations/)) run against the branch. If the checks pass, the branch is merged:

`MERGE BRANCH dev_sales_overhaul INTO main IN nessie`

The merge is a single catalog commit, so readers of `main` see either all five updated tables or none of them.

### 4. Rolling Back
If a bad change is merged, the branch can be reassigned to an earlier commit instead of repairing tables by hand:

`ASSIGN BRANCH main TO main AT <commit-hash> IN nessie`

This restores the catalog state for every table on that branch. Data written by later commits remains in storage until garbage collection removes it.

## Practical Considerations

* **Garbage collection:** Branches and tags keep old snapshots reachable. Nessie provides a garbage collection tool, and teams need retention rules so storage does not grow without limit.
* **Engine support:** Branch-aware reads and writes depend on the engine and its catalog integration. Check which engines in the stack support the catalog's versioning features.
* **Conflicts:** Merges can conflict when the same table was changed on both branches. Pipelines need a plan for retrying or resolving them.

## Conclusion

Data as Code brings version control workflows to lakehouse data: isolated development on branches, reproducible states through tags, atomic publication of multi-table changes through merges, and fast recovery by moving a branch back to an earlier commit. It is one of the practices that support [DataOps](/knowledgebase/dataops/) on an open [data lakehouse](/knowledgebase/data-lakehouse/).

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
