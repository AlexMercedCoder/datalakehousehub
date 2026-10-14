---
title: "Apache XTable (Incubating): Translating Metadata Between Iceberg, Delta Lake, and Hudi"
meta_title: "Apache XTable: Iceberg, Delta, Hudi Interop | Glossary"
description: "Apache XTable (incubating) translates table metadata between Iceberg, Delta Lake, and Hudi without copying data. See its limits and how it compares to UniForm."
---

Apache XTable (incubating, formerly OneTable) is an open-source tool that translates table metadata between [Apache Iceberg](/knowledgebase/apache-iceberg/), [Apache Hudi](/knowledgebase/apache-hudi/), and [Delta Lake](/knowledgebase/delta-lake/). It reads the metadata of a table in one format and writes equivalent metadata for the others, so engines that only speak one format can read the same data files. The project is in the Apache Incubator, not yet an Apache top-level project.

Without a translator, a team that writes Hudi but has consumers that only read Iceberg must either copy the data or pick one format for everyone. XTable avoids the copy by generating metadata only.

## How the Translation Works

XTable is neither a storage format nor a query engine. It is a sync process you run on a schedule or after commits.

All three formats keep data in columnar files, most often Apache Parquet, and differ mainly in how they track those files: Iceberg uses metadata files, manifest lists, and manifests; Delta Lake uses the `_delta_log` transaction log; Hudi uses a timeline in `.hoodie`. XTable reads the source format's schema, partition spec, file list, and column statistics, then writes the target format's metadata pointing at the same files.

### Zero-Copy Sync
Because only metadata is written, the data files in object storage are not rewritten or duplicated. The cost of a sync scales with the number of files and commits, not with data volume.

### Incremental Sync
After the first full sync, XTable can translate only the commits made since the last run, which keeps repeated syncs cheap on large tables.

## Current Limitations

Check these before you design around XTable:

- Merge-on-read tables in Hudi and Iceberg are not supported, and Delta Lake deletion vectors are not supported. Tables that rely on row-level deletes need copy-on-write mode or a different approach.
- Commit timestamps in the target formats do not exactly match the source.
- Apache Paimon is not a supported format today.
- Target metadata is only as fresh as the last sync, so readers of the translated format lag the source by your sync interval.

## XTable vs Delta UniForm vs Native Iceberg

| | Apache XTable | Delta Lake UniForm | Native Iceberg everywhere |
|---|---|---|---|
| Direction | Any of Iceberg, Delta, Hudi to the others | Delta as the source, Iceberg (and Hudi) metadata generated | No translation needed |
| How it runs | Separate sync job | Built into Delta writes | N/A |
| Row-level deletes | MoR and deletion vectors not supported | Has its own restrictions on features such as deletion vectors | Full support in the format spec |
| Catalog | You register the output in your catalog | Often paired with Unity Catalog | Any Iceberg REST catalog, such as [Apache Polaris](/knowledgebase/apache-polaris/) |
| Best fit | Mixed estates during migration | Databricks shops exposing Delta to Iceberg readers | New lakehouse builds |

Translation is a bridge. If most of your engines read Iceberg, writing Iceberg directly through a shared catalog removes the sync step and its lag. For a deeper comparison, read [When to use Apache XTable or Delta Lake UniForm](/blog/2025-01-xtable-or-uniform/) and [Lakehouse Table Formats in 2026](/blog/table-formats-2026-breakdown/).

## Example Use

A team ingests IoT events into a Hudi copy-on-write table with Apache Flink. An XTable job runs every 15 minutes and writes Iceberg metadata for the new commits. The BI team then registers that Iceberg table in its catalog and queries it from Dremio or Trino, while the data science team reads the Delta metadata from Spark. All three read the same Parquet files.

## Summary

Apache XTable gives teams with more than one table format a way to share data without copying it. It works best for append-heavy, copy-on-write tables and as a migration bridge, and its row-level delete limits make it a poor fit for heavily updated tables.


## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
