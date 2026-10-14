---
title: "What is Row-Level Deletes?"
meta_title: "What is Row-Level Deletes? | Expert Data Lakehouse & AI Glossary"
description: "Row-level deletes remove individual rows from a table without rewriting whole data files. Learn how open table formats like Apache Iceberg support them."
---

Row-level deletes are a way for a table built on immutable data files to remove or replace individual rows without rewriting the files that contain them. Instead of producing a new copy of a large Parquet file to drop a few rows, the writer records which rows are deleted in a separate, much smaller structure, and readers filter those rows out at query time. In Apache Iceberg, row-level deletes were added in format version 2 and are the basis of the merge-on-read write mode.

## How It Works

Iceberg defines three ways to encode deleted rows:

- **Position delete files (v2).** Each entry names a data file path and a row position within that file. Readers skip those positions. The current Iceberg spec says position delete files must not be added to v3 tables, though existing ones remain valid.
- **Equality delete files (v2 and v3).** Each entry gives column values, such as `customer_id = 1001`, and any row with matching values in older data files is treated as deleted. Writers do not need to read existing data first, which suits high-rate streaming upserts. The spec under development for v4, which has not been formally adopted, prohibits adding new equality delete files.
- **Deletion vectors (v3).** A bitmap of deleted row positions for exactly one data file, stored as a blob in a [Puffin file](/knowledgebase/puffin-files/). There can be at most one deletion vector per data file in a snapshot, so writers merge new deletes into the existing vector, and readers have one compact structure to apply per file.

An update under merge-on-read is a delete of the old row plus an insert of the new version in a new data file. Iceberg uses sequence numbers to decide which delete files apply to which data files, so a delete only affects data that was committed before it.

## Comparing the Delete Formats

| Format | Identifies rows by | Write cost | Read cost | Spec status |
|---|---|---|---|---|
| Position delete file | File path and row position | Must locate rows first | Moderate, may be many files per data file | v2; not added in v3 |
| Equality delete file | Column values | Low, no read needed | Higher, values must be matched against data | v2 and v3; prohibited in draft v4 |
| Deletion vector | Bitmap per data file | Must locate rows first | Low, one bitmap per file | v3 and later |
| Copy-on-write (no delete files) | Rewrites the file | Highest | Lowest | All versions |

## Row-Level Deletes in the Lakehouse

Row-level deletes are what make frequent changes practical on lakehouse tables. Change data capture pipelines, `MERGE` statements that apply daily corrections, and privacy requests to erase a person's records all need to change a few rows spread across many files. With [copy-on-write](/knowledgebase/copy-on-write/), each of those changes rewrites whole files. With [merge-on-read](/knowledgebase/merge-on-read/) and row-level deletes, the write is small and the cost moves to readers.

That read cost grows as delete files accumulate, so tables using row-level deletes need regular compaction, which rewrites data files with deletes applied and lets the delete files be dropped. For regulatory erasure, the deleted rows remain in older data files until compaction and snapshot expiration remove those files, which the Hub covers in [GDPR hard deletes on Iceberg](/blog/gdpr-hard-deletes-on-iceberg/).

Engine support varies by version, so check that every engine reading a table (Dremio, Spark, Trino, Flink, DuckDB, and others) supports the delete formats and table format version you write. The Hub's post on [Iceberg v3 deletion vectors and merge-on-read](/blog/iceberg-v3-deletion-vectors-merge-on-read/) covers the newest format.

## Summary

Row-level deletes let lakehouse tables remove or update individual rows by recording deletions separately from immutable data files. Iceberg supports position deletes, equality deletes, and v3 deletion vectors, each trading write cost against read cost, and all of them rely on compaction to keep reads fast over time.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
