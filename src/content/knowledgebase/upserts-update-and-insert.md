---
title: "What is Upserts (Update and Insert)?"
meta_title: "What is Upserts (Update and Insert)? | Data Lakehouse Hub Knowledge Base"
description: "An upsert updates a row if it exists and inserts it if it does not. Learn how SQL MERGE INTO and change data capture handle upserts on lakehouse tables."
---

# What is Upserts (Update and Insert)?

## Introduction to Upserts

In the world of data ingestion, moving data from an operational database (like PostgreSQL) into an analytical data warehouse (like Snowflake or an Iceberg Lakehouse) presents a complex logic problem. 

If you receive a file containing 10,000 user records from the operational database, you cannot simply `INSERT` them into the data warehouse. What if 5,000 of those users already exist in the warehouse? If you `INSERT` them, you will create duplicates. 

To prevent this, legacy ETL pipelines had to execute complex logic:
1. Query the warehouse to see if User ID `123` exists.
2. If it does exist, execute an `UPDATE` command to modify their email address.
3. If it does not exist, execute an `INSERT` command to add the new user.

Running this `IF/ELSE` logic row by row over millions or billions of rows is slow and error-prone.

The solution is the **Upsert** (a portmanteau of "Update" and "Insert"). An Upsert is a single, atomic database operation that decides whether each record should be updated or inserted based on a key.

## The SQL Implementation: MERGE INTO

In modern SQL databases and [Open Table Formats](https://opendatalakehouse.com/kb/open-table-formats/), the Upsert logic is usually expressed with the `MERGE INTO` statement (`MERGE` is part of the SQL standard since SQL:2003). 

Instead of writing Python logic to check for existence, the data engineer hands the 10,000 new records (the Source) to the database (the Target) and writes:

```sql
MERGE INTO lakehouse.users AS target
USING incoming_kafka_stream AS source
ON target.user_id = source.user_id
WHEN MATCHED THEN
  UPDATE SET target.email = source.email, target.last_login = source.last_login
WHEN NOT MATCHED THEN
  INSERT (user_id, email, last_login) VALUES (source.user_id, source.email, source.last_login)
```

The database engine handles the complexity internally. It joins the Source to the Target, decides which rows match, and applies the updates and inserts in a single ACID transaction.

## The Role of Upserts in CDC

Upserts are a core mechanism in **Change Data Capture (CDC)** architectures. 

In a CDC pipeline, a tool like Debezium constantly watches an operational database for changes. Whenever a row changes, it publishes a small change event (simplified here) to [Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/): `{"operation": "update", "user_id": 123, "email": "new@email.com"}`. 

A streaming engine (like [Apache Flink](https://datalakehousehub.com/knowledgebase/apache-flink/) or Spark Structured Streaming) reads these events from Kafka. Because events arrive continuously, and because messages can be delivered more than once, the pipeline relies on Upserts. By applying the changes as keyed upserts against the [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/) table (with `MERGE INTO` in Spark, or the upsert mode of Flink's Iceberg sink), a repeated update overwrites the same row instead of creating a duplicate, so the table stays in sync with the upstream database as long as changes are applied in order.

## Upserts in the Data Lakehouse

Historically, executing an Upsert against a Data Lake (Hadoop/S3) was impractical because Parquet files are immutable. You couldn't update a row in place; you had to rewrite whole files or partitions, with no transaction to protect concurrent readers.

The invention of **Apache Iceberg**, **[Delta Lake](https://datalakehousehub.com/knowledgebase/delta-lake/)**, and **[Apache Hudi](https://datalakehousehub.com/knowledgebase/apache-hudi/)** addressed this. These formats provide the transactional metadata layer required to run `MERGE INTO` operations against cloud object storage. 

Depending on the configuration, they handle the Upsert in two ways:
1.  **Copy-on-Write**: It reads each affected data file, applies the changes, and writes a complete replacement file to S3. Writes are slower, but reads stay fast.
2.  **Merge-on-Read**: It writes a small "Delete File" (marking the old version of the row as removed) and writes the new version into a new data file. Writes are much cheaper, but readers must merge the delete files at query time until compaction rewrites the data.

## Conclusion

The Upsert is one of the most important data mutation operations in modern analytics. By moving the existence-checking logic out of application code and into the database engine, Upserts enable resilient, idempotent data pipelines. They power near real-time database replication, keeping the [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) an accurate reflection of the operational systems.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
