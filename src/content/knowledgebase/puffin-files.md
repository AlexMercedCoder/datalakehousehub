---
title: "What Are Puffin Files? Apache Iceberg's Format for Statistics and Deletion Vectors"
meta_title: "Puffin Files in Iceberg: NDV Sketches and Deletion Vectors"
description: "Puffin is the Apache Iceberg file format for data too large for manifests. It stores Theta sketches for distinct counts and, in format v3, deletion vectors."
---

Puffin is a file format defined by [Apache Iceberg](/knowledgebase/apache-iceberg/) for storing blobs of information that do not fit in manifest files. A Puffin file is a simple container: a magic number (`PFA1`), a sequence of opaque blobs, and a JSON footer that describes each blob's type, the table columns it covers, the snapshot it was computed from, and its byte offset and length. The spec currently defines two blob types: Apache DataSketches Theta sketches for distinct-value estimates, and deletion vectors for row-level deletes.

## Why Iceberg Needed Puffin

[Iceberg manifests](/knowledgebase/iceberg-manifest-file/) store small, per-file statistics: row counts, null counts, and min and max values for each column. Query planners read them on every query to skip files. Two useful kinds of data do not fit that model:

- **Table-level distinct counts (NDV).** A cost-based optimizer wants to know how many distinct `customer_id` values a table holds. Per-file NDVs cannot be summed, and a mergeable sketch is kilobytes, too big to put inline in every manifest entry.
- **Row-level delete bitmaps.** A set of deleted row positions for one data file is variable in size, and storing it in a manifest would force manifest rewrites on every delete.

Puffin gives both a home outside the manifests, with random access: a reader fetches the footer and then only the blob it needs.

## Blob Type 1: Theta Sketches for Distinct Values

The `apache-datasketches-theta-v1` blob stores a compact Theta sketch per column. Theta sketches estimate distinct counts from a small sample of hashed values, and sketches from different files or partitions can be merged without losing accuracy. Each blob usually carries an `ndv` property with the precomputed estimate, so an engine can read the number from the footer alone.

These statistics files are listed in the table metadata's `statistics` section and tied to a snapshot ID. Trino writes them with `ANALYZE`, and Spark can write them with Iceberg's `compute_table_stats` procedure. Optimizers use the NDV values for join ordering, join distribution choices such as the [broadcast hash join](/knowledgebase/broadcast-hash-join/), and cardinality estimates.

## Blob Type 2: Deletion Vectors (Iceberg v3)

In Iceberg format version 3, `deletion-vector-v1` blobs replace position delete files for [row-level deletes](/knowledgebase/row-level-deletes/). Each vector is a Roaring bitmap of deleted row positions for exactly one data file. Manifests point to the vector by Puffin file path, offset, and size, so a reader loads one small bitmap and tests positions in constant time instead of decoding a Parquet delete file.

## Puffin vs Manifests vs Position Delete Files

| | Manifest file | Position delete file (v2) | Puffin file |
|---|---|---|---|
| Format | Avro | Parquet, ORC, or Avro | Puffin container (blobs plus JSON footer) |
| Holds | Per-file stats and file list | Data file path and deleted row positions | Theta sketches, deletion vectors |
| Scope | One entry per data or delete file | Can cover many data files | One blob per column set or per data file |
| Read pattern | Every query plan | Every read of affected data files | Footer plus one range read per needed blob |

Puffin is separate from Iceberg's partition statistics files, which store per-partition counts and sizes as rows in an ordinary data format such as Parquet. For the byte-level layout, read [Inside the Puffin File Format](/blog/inside-the-puffin-file-format/). For how deletion vectors change [merge-on-read](/knowledgebase/merge-on-read/) performance, see [How Iceberg V3 Deletion Vectors Fixed Merge-on-Read for Streaming Tables](/blog/iceberg-v3-deletion-vectors-merge-on-read/), and for the other statistics file type, [Partition Statistics Files in Apache Iceberg](/blog/iceberg-partition-statistics-files/).

## Frequently Asked Questions

### Do I need to create Puffin files myself?
No. Engines write them. Deletion vectors appear automatically when a v3 table uses merge-on-read deletes, and NDV statistics appear when you run a statistics job such as Trino's `ANALYZE`.

### Do all engines read Puffin statistics?
Support varies. Trino uses NDV sketches in its cost-based optimizer, and v3 deletion vector support depends on the engine and Iceberg library version. Check your engine's Iceberg documentation.

### What happens if statistics are stale?
Each blob records the snapshot it was computed from. Engines can still use older statistics as estimates, but after large changes you should recompute them so the optimizer works from current numbers.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
