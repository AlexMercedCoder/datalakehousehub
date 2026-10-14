---
title: "What is a Data Product?"
meta_title: "What is a Data Product? | Expert Data Lakehouse Architecture Guide"
description: "A data product is a dataset built and maintained like software for its users, a core idea in data mesh. Learn the traits that make one discoverable and trusted."
---

# What is a Data Product?

A Data Product is a foundational architectural concept within the Data Mesh approach. It holds that analytical data should not be treated as a passive byproduct of operational software (e.g., raw logs dumped into an Amazon S3 bucket). Instead, data should be treated like a formal software product, engineered to serve its internal consumers (data scientists, business analysts, and executives).

Historically, software engineers building an e-commerce application focused on making the application run well. They often generated messy JSON log files because the logs were only meant for temporary debugging. When the centralized data engineering team attempted to use those logs to build a financial dashboard, the pipelines frequently broke. The software engineers had little reason to care, because the data was just "exhaust." The concept of the Data Product reverses this dynamic, assigning accountability and ownership over the data structure.

## The Characteristics of a Data Product

To qualify as a Data Product, a dataset should meet the characteristics described in Zhamak Dehghani's original Data Mesh architecture.

### 1. Discoverable and Understandable
A Data Product cannot exist silently in a hidden database. It must be registered in a central Enterprise Data Catalog (like Collibra or Alation). Furthermore, it must be self-describing. It requires a detailed Business Glossary, explicitly defining what every column means (e.g., distinguishing between `gross_revenue` and `net_revenue`), so a new data scientist can understand the dataset without interviewing the original engineer.

### 2. Addressable and Secure
A Data Product must possess a permanent, unique global address (like a specific REST API endpoint or a permanent Iceberg table URI). It must also implement Role-Based Access Control (RBAC) under centrally defined policies. The owner of the Data Product decides which internal departments are legally allowed to query it.

### 3. Trustworthy (Strict SLAs)
This is a central shift. A Data Product should be backed by explicit Service Level Agreements (SLAs). The domain team owning the product commits, for example, that the data will be updated every day by 8:00 AM and that the `user_id` column will not contain a `NULL` value. If the Data Product violates this SLA, automated data observability tools trigger high-severity alerts, exactly as if a production website had crashed.

### 4. Interoperable
Data Products must adhere to global enterprise standards. A single organization might possess a "Sales Data Product" managed by the European team and a "Logistics Data Product" managed by the Asian team. Both products should use the same foundational Data Formats (e.g., Apache Parquet) and the same naming conventions for cross-cutting concepts (e.g., using standard ISO country codes), so that a central analyst can `JOIN` the two products together.

## The Anatomy of the Product

A Data Product is not just a table. It is an architectural quantum: the smallest deployable unit in the data mesh. It consists of three components:

1. **The Code:** The dbt SQL models, the Python ingestion scripts, and the Soda data quality YAML configurations required to build and test the data.
2. **The Data and Metadata:** The actual physical Apache Parquet files and the Iceberg manifests storing the data, alongside the human-written descriptions.
3. **The Infrastructure:** The automated CI/CD deployment pipelines and the dedicated compute resources required to physically serve the data to consumers.

## Summary of Technical Value

Treating data as a Product requires a significant organizational shift. By holding domain teams accountable for the usability, reliability, and security of the data they generate, organizations reduce the friction caused by centralized data engineering bottlenecks. It means analytical data is engineered with the same rigor, documentation, and automated testing traditionally reserved for critical software applications.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
