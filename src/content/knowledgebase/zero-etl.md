---
title: "What is Zero-ETL?"
meta_title: "What is Zero-ETL? | Expert Data Lakehouse & AI Glossary"
description: "Zero-ETL is an approach that connects operational databases to analytics systems without hand-built ETL pipelines, and how it relates to ELT and reverse ETL."
---

## What is Zero-ETL?

Zero-ETL is an approach in which operational data becomes available for analytics without the user building and maintaining an extract, transform, and load ([ETL](/knowledgebase/etl/)) pipeline. Data movement, if any, is handled by a managed integration between the source and the analytics system, or the data is queried where it already lives.

The name does not mean no data movement or no transformation ever happens. It means the customer does not write the pipeline. Transformations for analysis typically still happen afterward, inside the analytics system.

## Two Forms of Zero-ETL

### 1. Managed Replication Integrations
The term was popularized by AWS, which announced a zero-ETL integration between Amazon Aurora and Amazon Redshift in 2022. In AWS's description, a zero-ETL integration is a fully managed way to make transactional data available in Redshift: the user selects a source and a target, and after an initial load the service continuously replicates changes. AWS now offers zero-ETL integrations into Redshift from Aurora MySQL and PostgreSQL, RDS for MySQL, PostgreSQL, and Oracle, DynamoDB, and several SaaS applications.

Other platforms offer similar features, such as database mirroring into Microsoft Fabric and managed replication services in other clouds. Under the hood these use [change data capture](/knowledgebase/change-data-capture/) or log-based replication, but the pipeline is operated by the vendor, not the user.

### 2. Query in Place
The other form avoids copying altogether. A federated query engine or a data sharing feature lets analysts query operational or external data where it lives, for example through [federated data access](/knowledgebase/federated-data-access/), or by reading open table formats such as [Apache Iceberg](/knowledgebase/apache-iceberg/) directly from shared object storage. Here "zero-ETL" means the analytics engine reads the data without a separate load step.

## How Zero-ETL Differs from ETL and ELT

* **ETL:** a user-built pipeline extracts data, transforms it, and loads the result into the analytics store.
* **[ELT](/knowledgebase/elt/):** a user-built or tool-assisted pipeline extracts and loads raw data, then transforms it inside the warehouse or lakehouse. Connector tools that sync SaaS applications and databases into a warehouse are ELT tools, not zero-ETL.
* **Zero-ETL:** no user-built pipeline. Either the platform replicates the data as a managed integration, or the engine queries the data in place.

## Benefits and Limitations

**Benefits:**
* Less pipeline code to build and maintain.
* Fresher data, since managed replication typically runs continuously.
* Faster setup for supported source and target pairs.

**Limitations:**
* Integrations usually support specific sources and targets, often within one vendor's ecosystem.
* Raw replicated data still needs modeling and transformation for most analytics.
* Query-in-place approaches depend on the performance and availability of the source systems.
* Replication still consumes resources and incurs costs on the source, the target, or both.

## Frequently Asked Questions

### Does zero-ETL mean no data is copied?
Not necessarily. Managed integrations such as Aurora to Redshift do copy data. The difference is that the provider runs the replication. Only the query-in-place form avoids copying.

### What is Reverse ETL?
[Reverse ETL](/knowledgebase/reverse-etl/) moves data in the other direction: from the warehouse or lakehouse back into operational tools such as CRM or marketing systems.

### Does zero-ETL remove the need for data governance?
No. Replicated data inherits none of the source's business context by default, and access controls still need to be set in the target system or the query engine.

---

### Sources and further reading

- Amazon Redshift documentation, [Zero-ETL integrations](https://docs.aws.amazon.com/redshift/latest/mgmt/zero-etl-using.html)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
