---
title: "Iceberg Manifest List: What It Stores and How Engines Use It"
meta_title: "Iceberg Manifest List: Fields, Pruning and Time Travel"
description: "An Iceberg manifest list is the Avro file that lists every manifest in one snapshot. See its fields, how engines prune with it, and how v4 may replace it."
canonical: "https://iceberglakehouse.com/iceberg/iceberg-manifest-list/"
---

An Iceberg manifest list is a metadata file that lists the manifest files making up one snapshot of an [Apache Iceberg](/knowledgebase/apache-iceberg/) table. Each [snapshot](/knowledgebase/iceberg-snapshot/) in the table metadata points to exactly one manifest list, and each [manifest file](/knowledgebase/iceberg-manifest-file/) in that list tracks a set of data or delete files.

The hierarchy, top to bottom:

1. **Table metadata file** (`metadata.json`): schema, partition specs, snapshots, and the current snapshot ID.
2. **Manifest list** (one per snapshot, Avro): one entry per manifest, with summary statistics.
3. **Manifest files** (Avro): one entry per data or delete file, with column statistics.
4. **Data and delete files** (usually Parquet).

A new manifest list is written for every commit attempt, because every commit changes the set of manifests.

## What a Manifest List Entry Contains

Each entry is a `manifest_file` struct. The fields that matter most for planning:

| Field | Purpose |
|---|---|
| `manifest_path`, `manifest_length` | Where the manifest is and how big it is |
| `partition_spec_id` | Which partition spec the manifest was written with |
| `content` | Whether the manifest tracks data files or delete files (v2+) |
| `sequence_number`, `min_sequence_number` | Ordering used to apply deletes correctly (v2+) |
| `added_snapshot_id` | The snapshot that added this manifest |
| `added_files_count`, `existing_files_count`, `deleted_files_count` | File counts by status |
| `added_rows_count`, `existing_rows_count`, `deleted_rows_count` | Row counts by status |
| `partitions` | One `field_summary` per partition field: `contains_null`, `contains_nan`, `lower_bound`, `upper_bound` |
| `first_row_id` | Starting row ID for row lineage (v3) |

## How Engines Prune With It

Planning starts at the manifest list. If a table is partitioned by `days(event_ts)` and a query filters on one week, the engine compares that range to each manifest's partition `lower_bound` and `upper_bound` and skips manifests that cannot match, without opening them. Only the surviving manifests are read, where per-file column statistics prune further.

This works best when manifests are clustered by partition. If each manifest spans every partition, the summaries overlap and nothing gets skipped. Spark's `rewrite_manifests` procedure regroups manifests so the summaries become selective again; see [Avoiding Metadata Bloat with Snapshot Expiration and Rewriting Manifests](/blog/iceberg-metadata-bloat-cleanup/).

## Time Travel and Snapshot Expiration

Because each snapshot has its own manifest list, [time travel](/knowledgebase/time-travel/) is a lookup: pick the snapshot for a timestamp or ID, open its manifest list, and plan from there. Manifest lists from expired snapshots are deleted by snapshot expiration, along with any manifests and data files no longer referenced.

You can inspect manifest lists without touching Avro by querying metadata tables:

```sql
SELECT path, added_data_files_count, existing_data_files_count, partition_summaries
FROM catalog.db.events.manifests;
```

## The Manifest List in Iceberg v4

Today every commit rewrites the manifest list, so commit cost grows with the number of manifests, which hurts high-frequency streaming writes. Iceberg v4 design work proposes a root manifest that would replace the manifest list and let small commits write a single metadata file. As of October 2026 these are proposals under discussion, not a released spec. For background, read [Understanding the Apache Iceberg Manifest List](/blog/2024-8-understanding-apache-iceberg-manifest-list/) and [Iceberg v4's Adaptive Metadata Tree](/blog/iceberg-v4-adaptive-metadata-tree/).

## Summary

The manifest list is the per-snapshot index of manifests. Its partition summaries and file counts let engines such as Spark, Trino, Flink, and Dremio skip whole manifests during planning, and its one-per-snapshot design is what makes time travel cheap in a [data lakehouse](/knowledgebase/data-lakehouse/).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
