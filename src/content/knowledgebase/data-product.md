---
title: "What is a Data Product?"
meta_title: "What is a Data Product? | Expert Data Lakehouse Architecture Guide"
description: "A comprehensive guide to Data Products. Learn about Data Mesh principles, domain ownership, and treating analytical data like commercial software."
---

# What is a Data Product?

A Data Product is a foundational architectural concept within the Data Mesh paradigm. It dictates that analytical data should no longer be treated as a passive byproduct of operational software (e.g., raw logs dumped blindly into an Amazon S3 bucket). Instead, data must be treated exactly like a formal, commercial software product, engineered specifically to delight its internal consumers (data scientists, business analysts, and executives).

Historically, software engineers building an e-commerce application cared exclusively about making the application run quickly. They routinely generated incredibly messy, chaotic JSON log files because the logs were only meant for temporary debugging. When the centralized data engineering team attempted to use those logs to build a financial dashboard, the pipelines constantly crashed. The software engineers did not care, because the data was just "exhaust." The concept of the Data Product entirely reverses this dynamic, enforcing strict accountability and ownership over the data structure.

## The Characteristics of a Data Product

To officially qualify as a Data Product, a dataset must adhere to specific, rigorous engineering standards defined by Zhamak Dehghani's original Data Mesh architecture.

### 1. Discoverable and Understandable
A Data Product cannot exist silently in a hidden database. It must be explicitly registered in a central Enterprise Data Catalog (like Collibra or Alation). Furthermore, it must be completely self-describing. It requires a detailed Business Glossary, explicitly defining what every column means (e.g., distinguishing between `gross_revenue` and `net_revenue`), ensuring a new data scientist can understand the dataset immediately without interviewing the original engineer.

### 2. Addressable and Secure
A Data Product must possess a permanent, unique global address (like a specific REST API endpoint or a permanent Iceberg table URI). It must also implement rigorous, centralized Role-Based Access Control (RBAC). The owner of the Data Product strictly dictates exactly which internal departments are legally allowed to query it.

### 3. Trustworthy (Strict SLAs)
This is the most critical shift. A Data Product must be backed by strict Service Level Agreements (SLAs). The domain team owning the product guarantees that the data will be updated every day by 8:00 AM, and guarantees that the `user_id` column will never contain a `NULL` value. If the Data Product violates this SLA, automated data observability tools immediately trigger high-severity alerts, exactly as if a production website had crashed.

### 4. Interoperable
Data Products must adhere to global enterprise standards. A single organization might possess a "Sales Data Product" managed by the European team and a "Logistics Data Product" managed by the Asian team. Both products must use the exact same foundational Data Formats (e.g., Apache Parquet) and the exact same naming conventions for cross-cutting concepts (e.g., using standard ISO country codes), guaranteeing that a central analyst can `JOIN` the two disparate products together effortlessly.

## The Anatomy of the Product

A Data Product is not just a table. It is an architectural quantum—the smallest deployable unit in the data mesh. It consists of three components:

1. **The Code:** The dbt SQL models, the Python ingestion scripts, and the Soda data quality YAML configurations required to build and test the data.
2. **The Data and Metadata:** The actual physical Apache Parquet files and the Iceberg manifests storing the data, alongside the rich human descriptions.
3. **The Infrastructure:** The automated CI/CD deployment pipelines and the dedicated compute resources required to physically serve the data to consumers.

## Summary of Technical Value

Treating data as a Product forces a profound organizational shift. By holding specific domain teams strictly accountable for the usability, reliability, and security of the data they generate, organizations eliminate the immense friction caused by centralized data engineering bottlenecks. It ensures that analytical data is engineered with the same extreme rigor, documentation, and automated testing traditionally reserved exclusively for mission-critical software applications.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse), read the book "Lakehouse for Everyone" by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
