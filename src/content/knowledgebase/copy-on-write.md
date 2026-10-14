---
canonical: "https://opendatalakehouse.com/kb/copy-on-write/"
title: "What is Copy-On-Write?"
meta_title: "What is Copy-On-Write? | Expert Data Lakehouse & AI Glossary"
description: "Copy-on-write is a table update strategy that rewrites whole data files when rows change, trading slower writes for faster reads in formats like Apache Iceberg."
---

Copy-on-write (COW) is a strategy for applying updates and deletes to tables built on immutable files. When a row changes, the engine does not edit the file in place. It reads every data file that contains an affected row, writes a new version of each file with the change applied, and commits a new table snapshot that points to the new files instead of the old ones. Readers always see plain data files with no pending changes to reconcile, at the cost of rewriting more data on every write.

## How It Works

Suppose an Apache Iceberg table holds 500 MB Parquet files and a `DELETE` removes ten rows that happen to sit in two of them. Under copy-on-write:

1. The engine plans the operation and finds the two data files that contain matching rows.
2. It reads both files, filters out the ten rows, and writes two new files with the remaining rows.
3. It commits a snapshot that removes the two old files from the table and adds the two new ones.

The old files stay on storage until snapshot expiration removes them, which is what makes [time travel](/knowledgebase/time-travel/) to earlier snapshots possible. Updates and `MERGE` statements work the same way, with changed rows written into the replacement files.

In Iceberg, the strategy is set per operation through table properties: `write.delete.mode`, `write.update.mode`, and `write.merge.mode`. Each accepts `copy-on-write` or `merge-on-read`, applies to format version 2 and above, and defaults to `copy-on-write` according to the Iceberg configuration docs.

## Copy-on-Write vs Merge-on-Read

The alternative is [merge-on-read](/knowledgebase/merge-on-read/) (MOR), which leaves data files untouched and writes small delete files or deletion vectors that readers apply at query time.

| Aspect | Copy-on-write | Merge-on-read |
|---|---|---|
| Write cost | High: whole files rewritten for small changes | Low: only delete markers and new rows written |
| Read cost | Low: files are already final | Higher: readers must apply deletes |
| Write amplification | Grows with file size and spread of changes | Small per operation |
| Maintenance | Little extra beyond snapshot expiration | Regular compaction to fold deletes into data files |
| Best fit | Read-heavy tables, infrequent or batch updates | Frequent small updates, streaming upserts, CDC |

The choice is not permanent. Many teams use merge-on-read for frequent writes and then run compaction, which rewrites files with deletes applied, so readers get copy-on-write-like performance between maintenance runs.

## Copy-on-Write in the Lakehouse

Copy-on-write is the conservative default because it keeps reads simple for every engine. A Dremio, Trino, Spark, or DuckDB reader can scan a COW table without needing to understand delete files, and file-level statistics stay accurate because each file reflects its true contents.

It becomes expensive when updates are scattered. A `MERGE` that touches one row in each of a thousand files rewrites all thousand files. Partitioning and sort order help by clustering the rows that tend to change together into fewer files. Tables fed by streaming change data capture, or tables that receive frequent GDPR deletion requests, are usually better served by merge-on-read plus [data compaction](/knowledgebase/data-compaction/).

The Hub's [guide to Iceberg delete files](/blog/2024-8-understanding-apache-iceberg-delete-files/) shows how the merge-on-read side works, and the [row-level deletes](/knowledgebase/row-level-deletes/) entry covers the delete formats Iceberg supports.

## Summary

Copy-on-write applies row-level changes by rewriting the affected data files and committing a new snapshot. It favors fast, simple reads over write efficiency, and it is Iceberg's default for deletes, updates, and merges.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
