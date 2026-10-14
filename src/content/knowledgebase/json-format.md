---
title: "What is JSON?"
meta_title: "What is JSON (JavaScript Object Notation)? | Expert Architecture Guide"
description: "JSON is a human-readable text format for nested key-value data used by most web APIs. Learn why it is slow for analytics and how lakehouses turn it to Parquet."
---

# What is JSON (JavaScript Object Notation)?

JSON (JavaScript Object Notation) is a lightweight, open-standard, human-readable text format for storing and transporting structured and nested data. Derived from JavaScript object literal syntax and standardized as ECMA-404 and IETF RFC 8259, JSON is the most common format for REST APIs, mobile applications, and microservices to exchange data over the network.

To understand why JSON is so common, contrast it with the CSV format. A CSV is flat; it represents a simple two-dimensional table. But reality is rarely flat. 
If a single `Customer` has three different `Shipping Addresses` and five different `Orders`, representing that in a flat CSV requires duplicated rows or multiple files. JSON natively supports hierarchical, nested structures (Arrays and Objects). It can hold all the addresses and all the orders within a single `Customer` payload.

## The Architecture of Key-Value Pairs

A JSON document is simple, consisting mostly of Key-Value pairs wrapped in curly braces `{}`.

```json
{
  "customer_id": 1045,
  "name": "John Doe",
  "is_active": true,
  "shipping_addresses": [
    {"city": "New York", "zip": "10001"},
    {"city": "London", "zip": "E1 6AN"}
  ]
}
```

### Self-Describing Data
Unlike a CSV file (which requires a human to guess what the columns mean), JSON is self-describing. The Key (`"name"`) tells the receiving software what the Value (`"John Doe"`) represents. 
Furthermore, JSON has a few basic value types. It distinguishes strings (wrapped in quotes), numbers, booleans (`true`/`false`), and null, in addition to objects and arrays. It has no built-in date or decimal type, so pipelines that ingest it must infer or declare those.

## The Analytical Limitations of JSON

While JSON works well for software engineering and API transmission, it is a poor format for large-scale analytical storage in a [Data Lakehouse](/knowledgebase/data-lakehouse/).

### 1. Storage Overhead
Because JSON is self-describing, it repeats the Key for every record. If an API transmits a million customer records, the string `"customer_id"` is written a million times. Compression helps, but uncompressed JSON is much larger than the same data in a columnar format.

### 2. The CPU Parsing Penalty
JSON is plain text. It is not a binary format. When a query engine (like Apache Spark) reads a large JSON log file, it must parse every curly brace, bracket, and comma to rebuild the nested structure in memory, even for columns the query does not need. This parsing uses a lot of CPU and makes analytical queries much slower than on columnar files.

## Handling JSON in the Data Lakehouse

Because many SaaS platforms (such as Salesforce, Stripe, and Zendesk) expose their data through JSON APIs, data engineers handle a lot of it.

Many Data Lakehouse architectures use the ELT (Extract, Load, Transform) pattern. 
1. They ingest the raw JSON directly into the Bronze layer of the Data Lakehouse (for example in a `VARIANT` column in Snowflake, or in a string or variant column in a lakehouse table; Apache Iceberg format version 3 adds a variant type).
2. They use SQL functions (like `FLATTEN`) to expand the nested arrays into rows.
3. They write the flattened, cleaned data into the binary, columnar Apache Parquet format (the Silver/Gold layers), so downstream analytics no longer pay the JSON parsing cost.

## Summary of Technical Value

JSON is a basic building block of the web. By providing a lightweight, readable, self-describing text format that supports nested object hierarchies, JSON made it simple to exchange data between different software applications. While it is poorly suited for large-scale analytical storage, it remains the most common format for data ingestion and API integration.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
