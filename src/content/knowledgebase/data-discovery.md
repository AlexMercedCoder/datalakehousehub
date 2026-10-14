---
title: "Data Discovery in the Lakehouse: Catalogs, Profiling, and Trust"
meta_title: "Data Discovery for Iceberg Lakehouses | Glossary"
description: "Data discovery is how teams find, understand, and trust data before using it. See how discovery tools sit on top of Iceberg catalogs in a lakehouse."
---

Data discovery is the process of finding, understanding, and evaluating the data an organization holds before using it for analysis, machine learning, or dashboards. It answers three questions: where is the data, what does it mean, and can I trust it?

In a [data lakehouse](/knowledgebase/data-lakehouse/), an organization can easily accumulate thousands of tables across object storage buckets, operational databases, and SaaS sources. A data scientist building a churn model often spends more time locating the right activity table, working out what a column like `c_stat_act_v2` means, and checking whether the table is still maintained than writing the model code. Discovery tools reduce that time by indexing and documenting the data landscape.

## Discovery Platforms

Discovery is usually delivered by a [data catalog](/knowledgebase/data-catalog/) product. Commercial examples include [Alation](/knowledgebase/alation/) and [Collibra](/knowledgebase/collibra/); open-source options include [DataHub](/knowledgebase/datahub/), OpenMetadata, and [Amundsen](/knowledgebase/amundsen/). These tools act as a search index over the whole data estate.

### Metadata Harvesting
A discovery platform does not store the data itself. Connectors or crawlers pull technical [metadata](/knowledgebase/metadata/) from engines, catalogs, and tools such as Snowflake, Dremio, PostgreSQL, and dbt: table schemas, data types, and key relationships. The platform indexes that metadata so a search for "customer churn" returns related tables, views, and dashboards across systems.

## Profiling and Classification

Finding a table is the first step. Understanding its contents is the second.

* **[Data profiling](/knowledgebase/data-profiling/):** The platform runs lightweight statistical queries and reports min and max values, null percentages, and distinct counts per column, so a user can judge quality without writing SQL.
* **[Classification](/knowledgebase/data-classification/):** Many platforms tag columns using pattern matching or ML. A column named `ct_ssn` whose values match `XXX-XX-XXXX` can be tagged as sensitive PII and flagged for the governance team. These tags still need human review, because pattern-based classifiers produce false positives and misses.

## Business Context and Trust

Technical metadata does not explain business meaning. Discovery platforms add wiki-style descriptions, ownership, certifications, and comments so [data stewards](/knowledgebase/data-stewardship/) can mark a table as deprecated or certify it for financial reporting.

They also show [data lineage](/knowledgebase/data-lineage/): how data flowed from ingestion through transformations into the final table. Lineage lets a user check where numbers came from before relying on them, and lets engineers see which dashboards break if a source changes.

## Discovery on an Iceberg Lakehouse

In a lakehouse, two kinds of catalog are easy to confuse:

| Layer | Examples | What it does |
|---|---|---|
| Technical (table) catalog | [Apache Polaris](/knowledgebase/apache-polaris/), [Project Nessie](/knowledgebase/project-nessie/), [Unity Catalog](/knowledgebase/unity-catalog/) OSS, [AWS Glue](/knowledgebase/aws-glue/) Data Catalog | Tracks the current metadata file for each [Apache Iceberg](/knowledgebase/apache-iceberg/) table so engines can commit and read consistently, and enforces access |
| Discovery and governance catalog | DataHub, OpenMetadata, Alation, Collibra | Search, documentation, ownership, glossary terms, lineage across many systems |
| [Semantic layer](/knowledgebase/semantic-layer/) | Dremio views and wikis, dbt semantic models | Business-friendly views and metric definitions on top of the tables |

An Iceberg REST catalog knows that `sales.orders` exists and where its snapshots live, but it does not tell an analyst what "net revenue" means or who owns the table. Discovery tools fill that gap by harvesting from the table catalog and the engines that query it. Some lakehouse platforms combine both roles; Dremio, for example, offers catalog search, wikis, and tags next to its Iceberg catalog. For how the Iceberg REST catalog fits in, see [What Apache Iceberg REST Catalog is and isn't](/blog/2024-8-what-apache-iceberg-rest-catalog-is-and-isnt/), and for the boundary between documentation and business definitions see [Semantic Layer vs. Data Catalog](/blog/2026-02-semantic-layer-04-vs-data-catalog/).

## Summary

Data discovery turns a large collection of tables into something people can search and evaluate. By combining harvested metadata, profiling, classification, human documentation, and lineage, discovery platforms cut the time teams spend hunting for and verifying data. On a lakehouse they sit on top of the Iceberg table catalog rather than replacing it.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
