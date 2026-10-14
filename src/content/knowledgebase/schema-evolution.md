---
title: "What is Schema Evolution?"
meta_title: "What is Schema Evolution? | Expert Data Lakehouse Architecture Guide"
description: "Schema evolution is changing a table's columns without breaking existing data. See how Apache Iceberg column IDs allow adds, drops, renames and type promotion."
---

# What is Schema Evolution?

Schema Evolution is the architectural capability of a database or [data lakehouse](/data-lakehouse/) to change its structure (adding, dropping, renaming, reordering, or widening the data type of columns) without corrupting existing data or rewriting the table's data files.

In legacy Apache Hadoop environments built around Hive tables, altering a schema was risky. Depending on the file format and settings, Hive-era readers matched columns either by position or by name, and both cause problems. With position-based matching, if an engineer dropped the third column (`middle_name`), the fourth column (`last_name`) shifted into the third position, and queries read `last_name` values under the wrong column. With name-based matching, dropping a column and later adding a new one with the same name could bring the old values back. Avoiding these issues often meant rewriting large amounts of data with Spark or Hive jobs, which was slow and expensive.

Modern Open Table Formats (specifically [Apache Iceberg](/apache-iceberg/)) were designed to avoid these problems.

## The Architecture of ID-Based Tracking

Apache Iceberg makes schema evolution a metadata-only change because it does not track columns by position or name. Instead, it assigns each column a unique, permanent ID.

When a table is created in Iceberg, the table metadata assigns a permanent internal ID to every column.
* `first_name` = ID 1
* `middle_name` = ID 2
* `last_name` = ID 3

When the engine physically writes a Parquet file to Amazon S3, it records these IDs as field IDs in the Parquet file's schema, which lives in the file footer. 

### Dropping and Renaming Columns safely
If a data engineer executes an `ALTER TABLE DROP COLUMN middle_name` command, Iceberg does not modify the existing Parquet files. 

Iceberg writes a new table metadata file with an updated schema that no longer includes ID 2. When a user queries the table, the query engine reads the current schema, sees that ID 2 is no longer part of it, and ignores that field when reading the underlying files. The `last_name` column remains bound to ID 3. If a new `middle_name` column is added later, it gets a new ID, so old values are never read by mistake. 

Similarly, if an engineer executes `ALTER TABLE RENAME COLUMN first_name TO given_name`, Iceberg updates the name in the metadata. ID 1 stays the same. Because the underlying Parquet files are read by ID, old and new files both resolve to the same column, without rewriting any data.

## Type Promotion

Beyond simple renaming, schema evolution must handle changing data types. Operational systems sometimes widen their columns. A system might originally record a `revenue` column as a standard `Integer` (a 32-bit integer, with a maximum value of about 2.1 billion). If values grow past that limit, the operational system upgrades the column to a `BigInt` (Long).

If the Data Lakehouse cannot evolve, the ingestion pipeline will fail on the type mismatch.

Iceberg supports safe Type Promotion for widening changes such as `int` to `long`, `float` to `double`, and increasing decimal precision. An engineer can execute an `ALTER TABLE ALTER COLUMN revenue TYPE bigint`. An `Integer` can be widened to a `BigInt` without any data loss, so Iceberg allows it and updates the schema in metadata. When the query engine reads older Parquet files containing the smaller Integers, it converts them to `BigInt` values as it reads, so analysts can query historical data alongside the new data. Narrowing changes, such as `long` to `int`, are not allowed because they could lose data.

## Summary of Technical Value

Schema Evolution in modern table formats removed a costly and risky operational bottleneck in data engineering. By using permanent Column IDs rather than positions or names, Open Table Formats like Apache Iceberg allow organizations to add, drop, rename, reorder, and widen columns through metadata updates. This lets the Data Lakehouse adapt to changing upstream operational software without rewriting existing data files.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
