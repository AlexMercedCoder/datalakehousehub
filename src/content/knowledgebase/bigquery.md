---
title: "What is Google BigQuery?"
meta_title: "What is BigQuery? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Google BigQuery. Learn about its serverless architecture, columnar execution, Dremel engine, and massive data warehousing scale."
---

# What is Google BigQuery?

Google BigQuery is a fully managed, serverless enterprise data warehouse that enables scalable analysis over petabytes of data. Developed directly from Google’s internal Dremel query engine, BigQuery abstracts the entire underlying infrastructure away from the user. There are no servers to provision, no clusters to manage, and no indexes to configure. Users simply write standard SQL, and BigQuery executes the query in seconds across massive distributed datasets.

Because it operates as a completely serverless Platform as a Service (PaaS), organizations use BigQuery to democratize data access. Data analysts and engineers can focus entirely on uncovering insights and building machine learning models directly within the warehouse, without needing complex DevOps support to maintain database performance or uptime.

## The Serverless Dremel Architecture

To understand how BigQuery achieves its massive performance, it is critical to understand the architecture of its underlying execution engine, Dremel, combined with Google’s immense internal networking infrastructure.

### The Storage Layer: Capacitor
Data within BigQuery is stored in a proprietary columnar storage format called Capacitor. When data is ingested, BigQuery heavily compresses and encrypts the data, storing it persistently on Google’s distributed file system (Colossus). Because it uses a columnar layout, BigQuery reads only the specific columns requested by the SQL query, vastly reducing the I/O overhead required for aggregations. Furthermore, Capacitor maintains extensive metadata and statistics about the stored data to optimize query routing instantly.

### The Compute Layer: Dremel
The compute layer is completely decoupled from the storage layer. BigQuery executes queries using the Dremel engine, which utilizes a massive multi-tenant tree architecture. 
When a user submits a query, a Root Server receives the request. The Root Server routes the query down to intermediate Mixer Servers, which further distribute the query down to thousands of isolated execution nodes (Slot Workers) at the leaf level. The workers execute the physical calculations directly against the Capacitor storage chunks simultaneously. As the calculations complete, the results flow back up the tree, aggregating at the Mixers, before the final result is returned by the Root Server.

### The Network Layer: Jupiter
The sheer speed of BigQuery relies entirely on Google’s internal Jupiter network. Because storage and compute are entirely separate, massive amounts of data must be shuffled between the Colossus storage nodes and the Dremel compute nodes. Jupiter provides an immense, petabit-scale bi-directional network fabric, ensuring that reading data across the network is as fast as reading it from local disks.

## Serverless Resource Allocation

In a traditional cloud data warehouse (like Amazon Redshift or Snowflake), an organization must explicitly choose the size of their compute cluster. If the cluster is too small, complex queries queue and fail. If the cluster is too large, the organization wastes massive amounts of capital.

BigQuery eliminates this decision. It operates on a truly serverless model. The engine dynamically allocates computational resources (Slots) on a per-query basis. A simple query might instantly receive 50 slots, while an immensely complex JOIN across petabytes of data might dynamically burst to 2,000 slots to ensure it finishes quickly. Organizations can choose to pay strictly on-demand (per terabyte of data scanned by the query) or purchase dedicated capacity for predictable workloads.

## Embedded Machine Learning (BigQuery ML)

Historically, executing machine learning models required moving massive amounts of data out of the data warehouse into specialized Python environments using fragile data pipelines.

BigQuery disrupted this workflow by introducing BigQuery ML. Data analysts can create, train, evaluate, and predict using complex machine learning models directly within the BigQuery interface using standard SQL syntax. 

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

By executing the machine learning algorithms directly alongside the massive compute resources where the data lives, BigQuery ML drastically reduces architectural complexity and accelerates the deployment of predictive analytics.

## Integration with Open Formats

As the industry shifted toward Open Lakehouse architectures, BigQuery adapted through its BigQuery Omni and BigLake capabilities. Instead of requiring organizations to physically load data into the proprietary Capacitor storage format, BigQuery can establish external connections directly to open table formats (like [Apache Iceberg](/apache-iceberg)) residing in Google Cloud Storage, Amazon S3, or Azure. This allows BigQuery to serve as a unified compute engine over a distributed, multi-cloud [data lakehouse](/data-lakehouse).

## Summary of Technical Value

Google BigQuery fundamentally reshaped data warehousing by introducing a truly serverless architecture. By completely decoupling the heavy lifting of infrastructure management from the analytical workflow, it allows organizations of any size to execute petabyte-scale analytics in seconds. Its powerful columnar storage, dynamic resource allocation, and integrated machine learning capabilities make it a premier engine for the modern data stack.


## Learn More
To learn more about the Data Lakehouse, read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
