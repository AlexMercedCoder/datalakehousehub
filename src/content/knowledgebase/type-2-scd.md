---
title: "Type 2 SCD on Apache Iceberg: MERGE INTO Example and Time Travel"
meta_title: "Type 2 SCD with Iceberg MERGE INTO: Example | Glossary"
description: "A Type 2 slowly changing dimension keeps history by adding a new row for each change. See a MERGE INTO example on Iceberg and how it differs from time travel."
---

## What Is a Type 2 SCD?

A Type 2 slowly changing dimension (SCD) keeps the full history of a dimension record by inserting a new row every time a tracked attribute changes, instead of overwriting the old value. Each row carries validity columns, usually a start date, an end date, and a current-row flag, so facts can be joined to the version of the dimension that was true when they happened.

Example: a customer moves from Austin to Denver on 2026-06-01. A [Type 1 SCD](/knowledgebase/type-1-scd/) overwrites the city, and every past order now looks like it shipped to Denver. A Type 2 SCD keeps both rows:

| customer_sk | customer_id | city | valid_from | valid_to | is_current |
|---|---|---|---|---|---|
| 1001 | C-42 | Austin | 2024-03-10 | 2026-06-01 | false |
| 1187 | C-42 | Denver | 2026-06-01 | null | true |

The [surrogate key](/knowledgebase/surrogate-key/) (`customer_sk`) identifies a version, while the [natural key](/knowledgebase/natural-key/) (`customer_id`) identifies the customer. Fact tables store the surrogate key captured at load time, or join on the natural key with a date range condition.

## Building a Type 2 SCD on Apache Iceberg

[Apache Iceberg](/knowledgebase/apache-iceberg/) supports row-level `MERGE INTO` in engines such as Spark SQL, Dremio, and Trino, so a Type 2 dimension can be maintained in one atomic commit. A common pattern stages each changed record twice: once to close the current row and once (with a null merge key) to insert the new version.

```sql
MERGE INTO lake.gold.dim_customer t
USING (
  SELECT s.customer_id AS merge_key, s.* FROM staged_customers s
  UNION ALL
  SELECT NULL AS merge_key, s.* FROM staged_customers s
  JOIN lake.gold.dim_customer d
    ON s.customer_id = d.customer_id
  WHERE d.is_current = true AND s.city <> d.city
) u
ON t.customer_id = u.merge_key AND t.is_current = true
WHEN MATCHED AND t.city <> u.city THEN
  UPDATE SET is_current = false, valid_to = u.updated_at
WHEN NOT MATCHED THEN
  INSERT (customer_id, city, valid_from, valid_to, is_current)
  VALUES (u.customer_id, u.city, u.updated_at, NULL, true);
```

New customers match nothing and are inserted. Changed customers close their current row and get a new current row. Unchanged customers are left alone. Syntax details vary slightly by engine, and surrogate key generation is engine specific.

Practical notes for a lakehouse:

- **Feed it from CDC.** [Change data capture](/knowledgebase/change-data-capture/) tools like Debezium supply the changed rows for the staging table.
- **Watch file churn.** Frequent merges create small files and delete files. Schedule [compaction](/knowledgebase/data-compaction/) and pick copy-on-write or merge-on-read based on how often the table changes.
- **Keep it in the gold layer.** Type 2 dimensions usually live in the curated layer of a [medallion architecture](/knowledgebase/medallion-architecture/), built from cleaned silver data.

## Type 2 SCD vs Iceberg Time Travel

Iceberg [time travel](/knowledgebase/time-travel/) can query a table as of an earlier snapshot, which looks similar but answers a different question.

| | Type 2 SCD | Iceberg time travel |
|---|---|---|
| Tracks | Business validity (when the customer lived in Austin) | Table versions (what the table looked like at a commit) |
| Retention | Kept as long as the rows exist | Lost when snapshots are expired |
| Late corrections | Can backdate `valid_from` | Records when the fix was committed, not when it was true |
| Query pattern | Join on key plus date range | `FOR TIMESTAMP AS OF` or `VERSION AS OF` |

Use time travel for audits, debugging, and rollback. Use a Type 2 SCD when analysts need history as part of the data model. For the other SCD types, see [Type 3 SCD](/knowledgebase/type-3-scd/), [slowly changing dimensions](/knowledgebase/slowly-changing-dimensions/), and [Slowly Changing Dimensions: Types 1-3 with Examples](/blog/2026-02-data-modeling-06-slowly-changing-dimensions/).

---

### E-E-A-T & Further Reading
