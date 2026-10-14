---
title: "What is Semi-Structured Data (JSON, XML)?"
meta_title: "What is Semi-Structured Data (JSON, XML)? | Data Lakehouse Hub Knowledge Base"
description: "Semi-structured data like JSON and XML carries its own tags and nesting instead of a fixed schema. See how lakehouse engines query it and store it in Parquet."
---

# What is Semi-Structured Data (JSON, XML)?

## Introduction to Semi-Structured Data

In data architecture, data generally falls into two extremes. **Structured Data** is organized into relational rows and columns with a fixed schema. **[Unstructured Data](https://datalakehousehub.com/knowledgebase/unstructured-data/)** has no predefined data model, like free-form text or a JPEG image.

**Semi-Structured Data** occupies the middle ground. It does not obey the strict rules of a relational database (there are no predefined tables or columns), but it is not formless either. It uses internal tags or markers to separate semantic elements and enforce a hierarchy of records and fields. 

It is common across the web. API calls, web pages, configuration files, and application logs are usually written in semi-structured formats.

## The Dominant Formats: XML and JSON

Historically, there have been two primary formats for semi-structured data.

### XML (eXtensible Markup Language)
Popularized in the late 1990s and 2000s, XML uses opening and closing tags to structure data (similar to HTML).
```xml
<Customer>
    <ID>123</ID>
    <Name>Alex</Name>
    <Address>
        <City>Orlando</City>
    </Address>
</Customer>
```
XML supports strict validation through XML Schema, which suits formal enterprise data exchange (like many financial messaging standards), but its verbosity makes files larger than the equivalent JSON.

### JSON (JavaScript Object Notation)
JSON was popularized in the 2000s as a lighter alternative to XML and became the most common format for web APIs. It uses simple key-value pairs and arrays, making it easy for both humans and computers to read.
```json
{
  "customer_id": 123,
  "name": "Alex",
  "address": {
    "city": "Orlando"
  }
}
```
JSON is the usual format for REST APIs, many application configurations, and document databases.

## The Main Strength: Schema Evolution and Nesting

The main reason software engineers like semi-structured data is **flexibility**. 

If you use a relational database, adding a `phone_number` field requires an `ALTER TABLE` command, which in some databases and for some changes can lock the table or require a migration.

If you use a JSON document in a NoSQL database (like MongoDB), you simply add the `"phone_number": "555-1234"` key to the next document you save. The database accepts it without a schema change. This flexible schema supports fast iteration during development.

Furthermore, Semi-Structured data allows for **Nesting**. In a traditional normalized relational design, a list of items goes in a separate table joined back to the parent (although many modern databases also support array columns). In JSON, you simply create an array within the document: `"purchases": ["Laptop", "Mouse"]`. 

## The Analytical Challenge: The "Shredding" Problem

While JSON is convenient for software engineers building web apps, it is harder for data analysts to work with. 

Data warehouses (like Snowflake or BigQuery) are designed to run fast aggregations over flat columns. If a data engineer loads a large JSON string containing deeply nested arrays into a single text column, the analyst cannot easily query it using standard SQL. 

Historically, data engineers built ETL pipelines to "shred" or "flatten" the JSON. They wrote Python code to extract the nested `city` field from the JSON and map it to a flat `city` column in a relational table. 

## Modern Solutions in the Lakehouse

Modern [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) engines make JSON much easier to work with.

1.  **Native JSON Support**: Engines like [Dremio](https://opendatalakehouse.com/kb/dremio/), Trino, and Snowflake provide functions and syntax to query nested and JSON data directly. In Snowflake, for example, an analyst can write `SELECT raw_data:address.city FROM logs` to extract a nested value without flattening it first.
2.  **Columnar JSON**: Because JSON text files are slow to scan for analytics, tools often convert JSON into **[Apache Parquet](https://iceberglakehouse.com/iceberg/iceberg-parquet/)**. Parquet is capable of preserving the nested, semi-structured hierarchy of the JSON while applying columnar compression to it, keeping the nested structure while making analytical scans much faster.

## Conclusion

Semi-Structured data represents a compromise between the rigidity required by analytical databases and the flexibility required by agile software development. While it introduces complexity into the data engineering pipeline, modern lakehouse architectures and advanced SQL dialects have made it practical to ingest, query, and analyze large volumes of JSON, narrowing the gap between operational applications and enterprise analytics.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
