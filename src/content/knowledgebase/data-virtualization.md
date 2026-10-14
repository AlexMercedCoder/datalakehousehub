---
title: "What is Data Virtualization?"
meta_title: "What is Data Virtualization? | Expert Data Lakehouse Architecture Guide"
description: "Data virtualization lets users query many sources as if they were one database, without copying data. Learn about pushdown and how it pairs with a lakehouse."
---

# What is Data Virtualization?

Data Virtualization is an architectural approach that allows data consumers to query and analyze data across different source systems as if that data resided in a single, centralized database. It does this without running large, expensive ETL pipelines to physically move or copy the underlying data into a central data warehouse.

Historically, organizations believed that to achieve "single source of truth" business intelligence, they had to extract all of the data from Salesforce, Oracle, and MongoDB, and duplicate it inside a centralized Teradata or Snowflake instance. This extraction process was slow, brittle, and expensive. Data Virtualization challenges this premise. It provides a logical layer, a query routing engine, that sits above the fragmented data infrastructure. When an analyst queries the virtual layer, the engine sends work to the source systems, runs as much of the query there as it can, and returns the unified result.

## The Architecture of the Virtual Layer

A Data Virtualization engine (such as Dremio or Denodo) operates as middleware. It connects to many backend systems via standard protocols (JDBC, ODBC, REST). 

### The Unified Semantic Model
Instead of exposing the messy underlying schemas to the business analyst, data engineers use the virtualization platform to build a Virtual Semantic Model. 

They define a virtual View named `Global_Customer_Profile`. In the background, this view maps the `customer_id` from the on-premises Oracle database to the `crm_id` in the cloud-based Salesforce instance. The business analyst connects their Tableau dashboard to the virtualization engine and queries `Global_Customer_Profile` as if it were a standard table in a standard database. The analyst is shielded from the physical complexity of the underlying systems.

### Real-Time Routing and Execution
When the analyst clicks "Refresh" on their dashboard, the virtualization engine acts as a query compiler and router. 
1. It parses the SQL query.
2. It breaks the query apart, sending the Salesforce portion to the Salesforce API, and the Oracle portion to the Oracle database.
3. It retrieves the processed fragments, brings them into the virtualization engine's memory, executes the final `JOIN`, and serves the dashboard.

Because the data is queried directly at the source, the dashboard reflects the current state of the source systems, avoiding the delay of overnight batch ETL jobs.

## Advanced Pushdown Optimization

A poorly designed virtualization engine will attempt to pull all the raw data across the network before filtering it, overloading the network. 

Modern Data Virtualization relies on Pushdown Execution. If an analyst queries the virtualization engine for `SUM(revenue) WHERE country = 'Germany'`, the virtualization engine does not pull the entire global revenue table across the network. It translates the query into the source's SQL dialect and pushes the `SUM` and the `WHERE` clause down into the underlying Oracle database. The Oracle database executes the heavy math using its own local CPUs. It sends back a single number (the sum) over the network to the virtualization engine. This greatly reduces network transfer and helps virtualization stay practical at large scale.

## Virtualization vs Data Lakehouses

Data Virtualization is often integrated into the modern Open [Data Lakehouse](/data-lakehouse/) architecture.

Organizations use the Data Lakehouse (storing [Apache Iceberg](/apache-iceberg/) files on Amazon S3) to store most of their historical analytical data because it is low-cost and performs well. However, they use Data Virtualization engines (like Dremio) to federate queries joining that S3 historical data with live operational data residing in a fast PostgreSQL database. This hybrid approach keeps storage costs low while keeping the ability to query operational systems directly.

## Summary of Technical Value

Data Virtualization decouples data access from physical data storage. By establishing a unified, virtual semantic layer that routes queries to the source systems, organizations reduce the latency, fragility, and storage costs associated with traditional data duplication pipelines. It allows enterprises to operate a federated, flexible data architecture.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
