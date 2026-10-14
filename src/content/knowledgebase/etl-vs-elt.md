---
title: "What is ETL vs ELT?"
meta_title: "What is ETL vs ELT? | Data Lakehouse Hub Knowledge Base"
description: "ETL transforms data before loading it; ELT loads raw data first and transforms it in the warehouse or lakehouse. Compare the tradeoffs and when to use each."
---

# What is ETL vs ELT?

## Introduction to Data Integration Paradigms

Moving data from operational source systems (like CRM databases, ERP systems, and web APIs) into a centralized analytical environment (like a Data Warehouse or Lakehouse) is the core function of data engineering. 

For decades, the standard for this process was **ETL (Extract, Transform, Load)**. However, the rise of elastic cloud compute and the modern data stack has driven a broad shift toward **ELT (Extract, Load, Transform)**.

While they share the same letters, the order of operations leads to very different architectures, tooling, and team structures. Understanding the nuances between ETL and ELT is critical for designing performant and cost-effective data pipelines.

## The Traditional Approach: ETL (Extract, Transform, Load)

In the ETL paradigm, data is transformed *before* it reaches the final database.

1.  **Extract**: Data is pulled from the source system (e.g., a legacy SQL Server).
2.  **Transform**: The data is loaded into a dedicated, standalone processing server (an ETL tool like Informatica or Talend). Here, most of the computation occurs: data types are cast, strings are standardized, PII is masked, and tables are joined and aggregated.
3.  **Load**: The fully refined, business-ready data is written into the target Data Warehouse.

### Why was ETL the standard?
Historically, on-premises Data Warehouses (like Oracle or Teradata) were expensive. Compute cycles and storage space were limited. Teams could not afford to load raw, messy data into the warehouse and spend scarce warehouse CPU cycles cleaning it. The transformation *had* to be offloaded to a separate, cheaper ETL server before loading.

### Drawbacks of ETL
*   **Rigidity**: Because the transformation happens in a separate proprietary tool before loading, the raw data is discarded or never stored. If a business analyst suddenly wants to calculate a new metric using raw data, the engineers have to rewrite the ETL pipeline and reload historical data from the source.
*   **Maintenance Overhead**: Managing complex ETL servers, dealing with out-of-memory errors during heavy transformations, and maintaining proprietary GUI-based code limits engineering speed.

## The Modern Approach: ELT (Extract, Load, Transform)

The advent of cloud data warehouses (Snowflake, BigQuery) and cloud data lakehouses ([Dremio](https://opendatalakehouse.com/kb/dremio/), [Databricks](https://opendatalakehouse.com/kb/databricks/)) changed the economic constraints of data architecture. Storage in cloud object stores (like S3) became inexpensive, and cloud compute could scale on demand.

This gave rise to ELT.

1.  **Extract**: Data is pulled from the source system.
2.  **Load**: The raw, untouched data is loaded *immediately* into the [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) or Warehouse (often landing in the "Bronze" layer of a [Medallion Architecture](https://iceberglakehouse.com/iceberg/iceberg-medallion-architecture/)).
3.  **Transform**: The transformation logic is executed *inside* the target database using the platform's own distributed compute (typically using pure SQL via tools like **dbt**).

### Advantages of ELT
*   **Flexibility and Agility**: The raw data is safely preserved in the lakehouse. If business logic changes, analysts can write a new SQL query to re-transform the raw data, without needing to touch the fragile ingestion pipelines.
*   **Simplicity and Skillsets**: Instead of requiring specialized engineers who know proprietary ETL GUI tools, ELT relies on standard SQL. This opens transformation work to more people, allowing Data Analysts (Analytics Engineers) to build their own transformation pipelines using tools like dbt (data build tool).
*   **Scalability**: Instead of overloading a standalone ETL server, ELT uses the MPP (Massively Parallel Processing) architecture of engines like Trino or Snowflake to run transformations at large scale.

## Choosing Between ETL and ELT

While ELT is the common choice for modern cloud architectures, ETL still has specific use cases.

**When to use ETL:**
*   **Strict Security/Compliance**: If regulations forbid highly sensitive PII (like credit card numbers) from ever entering the cloud data warehouse, ETL must be used to mask or drop the data in transit before it lands.
*   **Legacy Systems**: When moving data into older, strictly constrained on-premises databases where compute cannot scale.

**When to use ELT:**
*   **Cloud [Data Lakehouses](https://iceberglakehouse.com/iceberg/data-lakehouse/)**: When writing to S3/Iceberg tables, ELT is the default. Raw JSON/CSV is loaded into S3, and engines like [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) or [Dremio](https://opendatalakehouse.com/kb/dremio/) are spun up to transform the raw files into optimized Parquet/Iceberg formats.
*   **Rapid Prototyping**: When the downstream reporting requirements are constantly changing, keeping raw data loaded via ELT allows a lot of flexibility in downstream modeling.

## Conclusion

The shift from ETL to ELT is not just a rearrangement of letters; it reflects how cloud computing has relaxed hardware constraints. By adopting ELT and pushing transformations down to the query engine using SQL-based tools, organizations can build faster, more resilient, and more flexible data pipelines that serve analysts and engineers alike.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
