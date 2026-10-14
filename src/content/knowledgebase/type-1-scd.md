---
title: "Type 1 SCD: Overwriting Dimension Changes with Iceberg MERGE INTO"
meta_title: "Type 1 SCD: Overwrite Updates with Iceberg MERGE INTO"
description: "A Type 1 SCD overwrites a dimension attribute in place and keeps no history. See how to implement it on Iceberg and why old snapshots still hold the old values."
---

## What is Type 1 SCD?

A Type 1 Slowly Changing Dimension (SCD) handles a change to a dimension attribute by overwriting the old value with the new one. The table keeps only the current state; no history of the previous value is stored in the dimension. It is the simplest of the [slowly changing dimension](/knowledgebase/slowly-changing-dimensions/) patterns.

Use Type 1 when the old value has no analytical meaning: a corrected typo in a customer name, a fixed email address, a standardized country code. If reports need to show what the value was at the time of a past transaction (a customer's region at the time of a sale, an employee's title at the time of a review), use [Type 2](/knowledgebase/type-2-scd/) instead.

## Type 1 vs Type 2 vs Type 3

| | Type 1 | Type 2 | Type 3 |
|---|---|---|---|
| On change | Overwrite the value | Close the old row, insert a new row | Move old value to a "previous" column |
| History kept | None in the dimension | Full | One prior value |
| Table growth | None | One row per change | None |
| Keys | Natural or surrogate key | Surrogate key required | Natural or surrogate key |
| Typical use | Corrections, non-analytical attributes | Attributes that change how facts are grouped over time | Before-and-after comparisons |

Many dimensions mix types: Type 1 for `email` and `phone`, Type 2 for `region` and `customer_tier`.

## Implementing Type 1 on Apache Iceberg

On an [Apache Iceberg](/knowledgebase/apache-iceberg/) table, Type 1 is a single `MERGE INTO`, supported by engines such as Spark, Dremio, and Trino:

```sql
MERGE INTO gold.dim_customer t
USING silver.customer_changes s
  ON t.customer_id = s.customer_id
WHEN MATCHED THEN UPDATE SET
  email = s.email,
  phone = s.phone
WHEN NOT MATCHED THEN INSERT (customer_id, email, phone)
  VALUES (s.customer_id, s.email, s.phone);
```

Two lakehouse details matter:

* **Old values survive in snapshots.** Each merge creates a new [Iceberg snapshot](/knowledgebase/iceberg-snapshot/). The overwritten values are still readable through [time travel](/knowledgebase/time-travel/) until those snapshots are expired and their files cleaned up. That is handy for debugging, but it is not a history strategy, because expiration removes it. It also matters for privacy: if a Type 1 update is meant to erase a value, expire the old snapshots too.
* **Write mode affects cost.** Frequent small Type 1 updates on a large dimension are cheaper with [merge-on-read](/knowledgebase/merge-on-read/) (delete files or deletion vectors, compacted later) than with [copy-on-write](/knowledgebase/copy-on-write/), which rewrites every touched data file on each merge.

For worked examples of all three types, read [Slowly Changing Dimensions: Types 1-3 with Examples](/blog/2026-02-data-modeling-06-slowly-changing-dimensions/).

## Frequently Asked Questions

### Does Type 1 lose data?
It loses the previous value from the current table. On Iceberg the old value remains in older snapshots until they expire, so it is not gone immediately.

### Can dbt do Type 1?
Yes. An incremental model with a `unique_key` and the merge strategy produces Type 1 behavior. dbt snapshots produce Type 2.

### Is Type 1 the same as an upsert?
In practice, yes. A Type 1 load is an [upsert](/knowledgebase/upserts-update-and-insert/): update matched rows, insert new ones.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
