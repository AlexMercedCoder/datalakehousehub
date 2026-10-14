---
title: "Google BigQuery: Architecture, Iceberg Tables, and Lakehouse Fit"
meta_title: "BigQuery: Architecture, Iceberg Tables, Lakehouse Fit"
description: "Google BigQuery is a serverless cloud data warehouse built on the Dremel engine. See how it reads and writes Apache Iceberg tables in an open lakehouse."
---

Google BigQuery is a fully managed, serverless cloud data warehouse for analyzing data up to petabyte scale. It is built on Dremel, Google's internal query engine, and hides the infrastructure from the user: there are no servers to provision and no clusters to manage. Users write SQL (GoogleSQL), and BigQuery distributes the work across Google's shared compute pool.

Because it is offered as a serverless service, teams do not size or patch clusters. Analysts and engineers spend their time on queries, models, and BigQuery ML rather than on database operations.

## The Serverless Dremel Architecture

BigQuery's performance comes from three pieces of Google infrastructure: the Capacitor storage format, the Dremel execution engine, and the Jupiter data center network.

### The Storage Layer: Capacitor
Data within BigQuery is stored in a proprietary columnar storage format called Capacitor. When data is ingested, BigQuery compresses and encrypts it and stores it on Google's distributed file system (Colossus). Because the layout is columnar, a query reads only the columns it references, which cuts I/O for aggregations. Capacitor also keeps statistics that let the engine skip data it does not need.

### The Compute Layer: Dremel
Compute is separate from storage. BigQuery executes queries with Dremel, a multi-tenant engine organized as an execution tree.
When a user submits a query, a root server receives the request and routes it to intermediate mixer servers, which distribute the work to leaf workers that run in units of compute called slots. The leaf workers scan Capacitor data in parallel, partial results flow back up the tree and are combined at the mixers, and the root server returns the final result.

### The Network Layer: Jupiter
Because storage and compute are separate, data has to move between Colossus and the Dremel workers, and shuffles move between workers. Google's Jupiter network provides petabit-scale bisection bandwidth, which keeps remote reads and shuffles from becoming the bottleneck.

## Serverless Resource Allocation

In provisioned warehouses, an organization picks a cluster or warehouse size. Too small and queries queue; too large and money is wasted.

BigQuery allocates slots to each query dynamically, so a small query uses few slots and a large join uses many. Organizations either pay on demand (per TiB of data scanned) or buy capacity through BigQuery editions for predictable workloads.

## Embedded Machine Learning (BigQuery ML)

Historically, training a model meant exporting data from the warehouse into a separate Python environment and maintaining the pipeline that moved it.

BigQuery ML lets analysts create, train, evaluate, and run models with SQL statements inside BigQuery.

```sql
-- Creating a machine learning model directly in SQL
CREATE MODEL `project.dataset.customer_churn_model`
OPTIONS(model_type='logistic_reg') AS
SELECT
  user_id,
  account_tenure,
  recent_activity_score,
  churn_flag
FROM
  `project.dataset.historical_customer_data`;
```

Training next to the data removes an export step and the pipeline that would otherwise maintain it.

## BigQuery in an Open Lakehouse

BigQuery's native storage is proprietary, but Google now offers several ways to work with [Apache Iceberg](/knowledgebase/apache-iceberg/) tables stored in your own Cloud Storage buckets. BigQuery Omni extends the same query engine to data in Amazon S3 and Azure.

| Option | Who writes | Who reads | Catalog |
|---|---|---|---|
| BigQuery native tables | BigQuery | BigQuery (other engines through the Storage Read API) | BigQuery |
| Iceberg managed tables (formerly BigLake tables for Apache Iceberg in BigQuery) | BigQuery, with DML, streaming ingest, and automatic file optimization | BigQuery; other engines through exported Iceberg metadata | BigQuery |
| Iceberg tables in BigLake metastore | Open source engines such as Spark through the Iceberg REST catalog | BigQuery, Spark, Trino, and other REST clients | BigLake metastore (Iceberg REST) |

The practical question is which engine owns writes. If BigQuery is the main writer, managed Iceberg tables give you warehouse features on open files. If Spark, Flink, or another engine writes, the BigLake metastore REST catalog lets BigQuery read the same tables without copying them. Engines such as Dremio can also query BigQuery directly and join it with Iceberg tables in other clouds; see [Connect Google BigQuery to Dremio Cloud](/blog/2026-03-connect-google-bigquery-dremio/). For catalog choices across clouds, read [What Are Lakehouse Catalogs?](/blog/2026-04-29-apache-iceberg-masterclass-07-lakehouse-catalogs/) and [Multi-Cloud REST Catalog Topologies](/blog/multi-cloud-polaris-rest-catalog-topologies/).

## Summary

BigQuery is a serverless warehouse that separates storage and compute and allocates slots per query. Its Iceberg support means a [data lakehouse](/knowledgebase/data-lakehouse/) on Google Cloud can keep data in open files while still using BigQuery as one of several engines.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
