---
title: "What is Merge-On-Read?"
meta_title: "What is Merge-On-Read? | Expert Data Lakehouse & AI Glossary"
description: "Merge-on-read is a table write strategy that stores updates and deletes in separate files and merges them with data files at query time, as Apache Iceberg does."
---

## What is Merge-On-Read?

Merge-on-read (MOR) is a strategy for handling row-level updates and deletes in a table format. Instead of rewriting the data files that contain changed rows, the writer records the changes in separate files. When a query reads the table, the engine merges those change files with the original data files at read time, so the query sees the current state of each row.

The alternative is [copy-on-write](/knowledgebase/copy-on-write/) (COW), where every update or delete rewrites the affected data files in full. Copy-on-write makes writes more expensive and reads simpler. Merge-on-read makes writes cheaper and shifts some work to reads.

## How Merge-On-Read Works in Apache Iceberg

[Apache Iceberg](/knowledgebase/apache-iceberg/) supports merge-on-read through delete files, introduced in format version 2:

* **Position delete files** identify deleted rows by data file path and row position.
* **Equality delete files** identify deleted rows by column values, for example every row where `id = 5`. They are common in streaming and change data capture writers that do not know where a row is stored.
* **Deletion vectors** (format version 3) store deleted row positions for a data file as a compact bitmap in a Puffin file, and replace position delete files for v3 tables.

An `UPDATE` under merge-on-read is written as a delete of the old row version plus an insert of the new version in a new data file. Each commit produces a new snapshot that references the data files and delete files that apply. During scan planning, the reader uses sequence numbers and partition information to determine which delete files apply to which data files, and while reading, it filters out the deleted rows.

In Iceberg, the choice is set per operation with table properties: `write.delete.mode`, `write.update.mode`, and `write.merge.mode` each accept `copy-on-write` or `merge-on-read`. Other formats have equivalents: Delta Lake uses deletion vectors, and Apache Hudi offers a Merge-on-Read table type.

## Trade-Offs

* **Writes:** Merge-on-read writes only the changed rows and small delete files, so frequent small updates and deletes are much cheaper than rewriting whole files.
* **Reads:** Readers must apply delete files, which adds work. The cost grows as delete files accumulate.
* **Maintenance:** Tables that use merge-on-read need regular compaction, which rewrites data files with deletes applied and removes the delete files from the current snapshot. Snapshot expiration then allows the old files to be cleaned up.

Merge-on-read fits workloads with frequent row-level changes, such as CDC ingestion and streaming upserts. Copy-on-write fits tables that change rarely and are read heavily.

## Frequently Asked Questions

### Does merge-on-read physically remove deleted data?
Not immediately. The original data files still contain the deleted rows until compaction rewrites them and older snapshots are expired. This matters for privacy requirements that call for data to be erased.

### Is merge-on-read the same as a lakehouse?
No. Merge-on-read is one write strategy that table formats use to support row-level changes. A lakehouse uses a table format and a catalog to give data lake files database-like features, such as transactions and schema evolution.

### Which engines support merge-on-read with Iceberg?
Support depends on the engine and its version. Apache Spark, Apache Flink, Trino, and Dremio, among others, can read Iceberg tables with delete files, and several can write them. Check each engine's documentation for which delete file types it writes.

---

### Sources and further reading

- Apache Iceberg, [Table Spec](https://iceberg.apache.org/spec/)
- Apache Iceberg, [Configuration: write properties](https://iceberg.apache.org/docs/latest/configuration/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
