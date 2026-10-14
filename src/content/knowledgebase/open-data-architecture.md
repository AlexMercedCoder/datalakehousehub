---
title: "What is Open Data Architecture?"
meta_title: "What is Open Data Architecture? | Expert Data Lakehouse & AI Glossary"
description: "Open data architecture is an approach that keeps data in open file and table formats so different tools and engines can work on the same data without copies."
---

## What is Open Data Architecture?

Open data architecture is an approach to building a data platform on open standards (open file formats, open table formats, and open catalog protocols) so that different tools can work on the same data and can be swapped without migrating it. 

In a closed architecture, data is stored in a vendor's proprietary format and can only be used through that vendor's engine. An **Open Data Architecture** keeps data in formats such as Apache Parquet and Apache Iceberg on storage the organization controls, and exposes it through open catalogs such as Apache Polaris. Query engines, BI tools, and AI applications then become interchangeable layers on top of the same data.

## Core Architecture and Mechanics

In practice, an open data architecture also needs clear design patterns on top of those standards:

* **Organizes data into tiers of refinement, from raw ingestion to business-ready presentation.** The Medallion pattern (Bronze, Silver, Gold) is a common example.
* **Applies modeling methods (like Star Schemas or Data Vault) so tables suit the queries run against them.** Because the tables are in an open format, any engine can use the same models.
* **Manages historical changes with established patterns like Slowly Changing Dimensions (SCD).** Table format features such as Iceberg snapshots add time travel on top.

These patterns are typically implemented with tools like dbt on [Apache Iceberg](/knowledgebase/apache-iceberg/) tables, queried by engines such as Spark, Trino, Flink, and Dremio.

## Why Open Data Architecture Matters in the Modern Data Stack

Open standards reduce lock-in, and clear architectural patterns help keep the data lake from turning into a 'data swamp', so users know where to find reliable, validated information.

For organizations with many teams, an open architecture lets each team choose the tool that fits its workload while sharing one copy of the data. It also lowers the cost of adopting new tools later, because data does not need to be exported from a proprietary system first.

### Key Benefits
- **Tool Choice:** Multiple engines and applications can work on the same data.
- **Vendor Neutrality:** Data stays in open formats on storage you control.
- **Longevity:** Open specifications remain readable even if a particular tool is retired.

## Frequently Asked Questions

### What is the Medallion Architecture?
It is a logical layout dividing the lakehouse into Bronze (raw), Silver (cleansed), and Gold (business-ready) tables. Each layer is typically stored as open-format tables, so any engine can read any layer.

### What are Slowly Changing Dimensions?
SCDs are structural techniques used to retain historical states of a record (like tracking an employee's previous job titles) rather than simply overwriting old data. In a lakehouse, SCD Type 2 tables are often maintained with `MERGE` statements on Iceberg tables.

### How does Open Data Architecture impact data governance and security?
Governance in an open architecture is usually centralized in the catalog, which applies access rules no matter which engine connects. Clear layers also make it easier to decide which data each group may see.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
