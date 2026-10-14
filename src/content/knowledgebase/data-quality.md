---
canonical: "https://opendatalakehouse.com/kb/data-quality/"
title: "What is Data Quality?"
meta_title: "What is Data Quality? | Expert Data Lakehouse Architecture Guide"
description: "Data quality is how accurate, complete, consistent, and timely data is for its use. See how teams enforce it with data contracts, tests, and anomaly checks."
---

# What is Data Quality?

Data Quality is the engineering discipline of making sure that the data flowing through an enterprise architecture is accurate, consistent, timely, and structurally reliable. 

Historically, data quality was viewed as a passive, reactive reporting problem. If an operational system pushed corrupted data into the warehouse, the business simply discovered the error on a broken dashboard weeks later. The data team would scramble to manually execute deletion scripts to clean up the mess. In modern architectures, Data Quality has become a programmatic software engineering discipline. Just as software engineers do not deploy code without passing CI/CD unit tests, data engineers do not merge data into the lakehouse without it passing automated quality assertions.

## The Core Dimensions of Data Quality

Establishing trust in a [Data Lakehouse](/knowledgebase/data-lakehouse/) requires evaluating data across multiple dimensions. Frameworks and platforms (like Great Expectations, Soda, and Monte Carlo) monitor these dimensions continuously.

1. **Accuracy:** Does the data reflect reality? (e.g., A customer's age cannot be 250 years).
2. **Completeness:** Are critical fields missing? (e.g., A transaction record must contain a valid `payment_amount`; it cannot be `NULL`).
3. **Consistency:** Is the data logically aligned across systems? (e.g., The total revenue reported in the Marketing CRM must match the total revenue reported in the Financial general ledger).
4. **Freshness:** Is the data arriving on time? (e.g., A real-time fraud detection table that has not received an update in three hours has failed a critical freshness check).
5. **Uniqueness:** Are there duplicate records? (e.g., The `Customer_Dimension` table must contain exactly one row per `customer_id`).

## Implementation Mechanisms

To prevent corrupted data from reaching business stakeholders, data teams deploy automated quality gates directly within the ingestion and transformation pipelines.

### Data Contracts and Schema Validation
The first line of defense is the Data Contract. This is an explicit agreement between the software engineers producing the data and the data engineers consuming it. Before data is extracted from an API or Kafka topic, it is validated against a defined schema (often using Confluent Schema Registry with Avro or Protobuf). If an upstream engineer accidentally renames the `user_id` column to `uid`, the pipeline detects the contract violation and rejects the payload, keeping the malformed data out of the Bronze layer.

### Programmatic Assertions
Once data lands in the lakehouse, the transformation pipeline executes assertions. Using tools like dbt tests or Great Expectations, engineers write explicit rules: `assert purchase_amount > 0`. 

These tests execute immediately after a transformation job runs in a staging environment. If the dataset fails a single critical test, the orchestrator (like Apache Airflow) fails the pipeline on purpose. It aborts the publish step, so the bad staging data is not merged into the production Gold tables. This follows the Write-Audit-Publish (WAP) pattern.

### Automated Anomaly Detection
While static assertions (`amount > 0`) catch obvious errors, they miss subtle systemic drift. If a website usually processes 10,000 orders a day, and suddenly processes only 2,000, no explicit rule was broken, but something likely went wrong. Data Observability platforms use machine learning to establish historical baselines. They monitor the statistical distribution of the data and trigger an alert if the volume or cardinality deviates significantly from the expected historical trend.

## Summary of Technical Value

Data Quality is the foundation of organizational trust in data. Without automated quality enforcement, a large data lakehouse can turn into a swamp of unreliable information. By embedding schema validation, programmatic assertions, and anomaly detection into the pipeline architecture, data engineering teams make sure that executive dashboards and AI models run on tested, validated data.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
