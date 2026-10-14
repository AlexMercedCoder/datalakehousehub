---
title: "What is Vendor Lock-in?"
meta_title: "What is Vendor Lock-in? | Data Lakehouse Hub Knowledge Base"
description: "Vendor lock-in is dependence on one provider that makes switching costly, and how open storage plus open file and table formats keep data portable."
---

# What is Vendor Lock-in?

## Introduction to Vendor Lock-in

Imagine buying a car, but the manufacturer designs the gas tank so that it only accepts fuel from the manufacturer's own, more expensive gas stations. If you want cheaper gas from a competitor, you have to replace the car.

That situation is what the technology sector calls **Vendor Lock-in**.

Vendor Lock-in occurs when a company becomes so deeply dependent on a specific cloud provider or software vendor that the financial, technical, and operational costs of switching to a competitor become very high. The customer has little negotiating power, which lets the vendor raise prices with less risk of losing the business.

## The Mechanics of Data Lock-in

In Data Engineering, vendor lock-in historically occurred at the Data Warehouse level.

An enterprise that committed to a proprietary Data Warehouse could encounter three layers of lock-in:

1.  **Ingress/Egress Costs**: Cloud providers typically do not charge for data transferred *into* their systems (Ingress). Moving large volumes of data back out to another provider incurs "Egress Fees" for network transfer, which can be significant at petabyte scale.
2.  **Proprietary Storage Formats**: The vendor did not store the data as standard CSV or Parquet files. They stored it in proprietary internal formats. The customer could only read the data through the vendor's own engine, or by exporting it first.
3.  **Proprietary SQL Dialects**: The company's data analysts spent years writing thousands of complex SQL scripts using the vendor's proprietary SQL functions and extensions. To migrate to a new vendor, many of those scripts would have to be rewritten and retested, which can take a long time.

## Breaking the Lock: The Open Data Architecture

The modern **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/)** architecture was designed in large part to reduce Vendor Lock-in. Many data leaders build their platforms around an "Open Architecture" approach.

### 1. Open Storage (Cloud Agnostic)
Instead of storing data inside the database, companies store it in low-cost Cloud Object Storage (like [Amazon S3](https://datalakehousehub.com/knowledgebase/amazon-s3/) or Azure ADLS). Because the data lives outside any one engine, the company controls the physical files directly.

### 2. Open File and Table Formats
Companies standardize on open, non-proprietary formats:
*   **Open File Formats**: [Apache Parquet](https://iceberglakehouse.com/iceberg/iceberg-parquet/) or Apache ORC.
*   **[Open Table Formats](https://opendatalakehouse.com/kb/open-table-formats/)**: [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/).
Because Apache Iceberg is an open specification with open-source libraries, many compute engines can read and write it. 

### The Result: Compute Agnosticism
Because the data is sitting in an open format in neutral storage, the company has much more negotiating power. 
If Compute Engine A raises its prices, the company does not have to migrate petabytes of data. It can point Compute Engine B (like [Dremio](https://opendatalakehouse.com/kb/dremio/)) at the same catalog and S3 bucket and query the same Iceberg tables. Some switching work remains, such as translating engine-specific SQL and re-creating permissions, but the data itself does not move.

## Conclusion

Vendor Lock-in is a major financial risk for a long-term enterprise data strategy. By decoupling storage from compute and standardizing on open-source data formats like [Apache Parquet](https://iceberglakehouse.com/iceberg/iceberg-parquet/) and Apache Iceberg, data architects keep their organization's options open, so vendors have to compete on price and performance rather than on the cost of leaving.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
