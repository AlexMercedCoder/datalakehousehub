---
title: "Arrow Flight SQL vs JDBC and ODBC for Lakehouse Queries"
meta_title: "Arrow Flight SQL vs JDBC/ODBC for Lakehouses | Glossary"
description: "Arrow Flight SQL is a protocol for running SQL queries over Apache Arrow Flight. Learn how it compares to JDBC, ODBC, and ADBC when pulling lakehouse data."
---

Arrow Flight SQL is a protocol for interacting with SQL databases using the [Apache Arrow](/knowledgebase/apache-arrow/) columnar format and the [Arrow Flight](/knowledgebase/arrow-flight/) RPC framework. It defines how a client lists catalogs and tables, runs queries and prepared statements, and receives results, with both metadata and result sets returned as Arrow data. Flight itself is built on gRPC.

## Why It Exists

Traditional JDBC and ODBC drivers were designed around row-oriented results. Many analytical engines compute results in columnar form, and many client tools (pandas, Polars, DuckDB, machine learning libraries) also work best with columnar data. With a row-based driver, the server converts columnar results into rows, the driver sends them, and the client converts them back into columns. For large result sets, that conversion on both ends can take more time than the query itself.

Flight SQL removes most of that conversion. If the engine already holds results as Arrow record batches, it can stream them to the client in the Arrow IPC format, and an Arrow-native client can use them with little or no transformation. Data is still sent over the network and may be compressed or encrypted with TLS, so this is not literally zero-copy end to end, but the row-to-column round trip goes away.

## How a Flight SQL Query Works

1. The client sends a SQL command through the `GetFlightInfo` call.
2. The server plans the query and returns a `FlightInfo` describing the result schema and one or more endpoints, each with a ticket.
3. The client calls `DoGet` with each ticket and receives a stream of Arrow record batches.

Because results can be split across multiple endpoints, a server can let clients fetch parts of a result from different nodes. Whether that happens depends on the server's implementation; many servers return a single endpoint.

Flight SQL also removes the need for a database-specific client driver: any Flight SQL client can talk to any server that implements the protocol.

## Flight SQL vs JDBC, ODBC, and ADBC

| | JDBC / ODBC | Arrow Flight SQL | ADBC |
|---|---|---|---|
| What it is | Client APIs plus database-specific drivers | Wire protocol over Arrow Flight (gRPC) | Client API for columnar database access |
| Result format | Rows | Arrow record batches | Arrow record batches |
| Driver per database | Usually yes | No; one generic client | One API; drivers include a Flight SQL driver |
| Best for | Broad BI tool compatibility | Engines that compute in Arrow | Python, R, Go, and similar data apps that want Arrow results |

ADBC (Arrow Database Connectivity) and Flight SQL complement each other: ADBC is the API your application calls, and Flight SQL is one protocol an ADBC driver can use. There is also an Arrow Flight SQL JDBC driver for tools that only speak JDBC.

## Flight SQL on a Data Lakehouse

In a [data lakehouse](/knowledgebase/data-lakehouse/), the common use is pulling large query results from an engine into Python or other analytics tools. Dremio exposes an Arrow Flight endpoint, so a notebook can run SQL over [Apache Iceberg](/knowledgebase/apache-iceberg/) tables and receive results directly as Arrow tables for pandas, Polars, or DuckDB. Other databases and engines also offer Flight SQL servers; check each engine's docs for current support.

For more depth, read [Arrow Flight SQL and ADBC: Why the Database Driver Is the Slowest Part of Your Query](/blog/arrow-flight-sql-adbc-connectivity/) and [High-Performance Columnar Transfers: Combining Apache Arrow Flight and Iceberg REST Catalogs](/blog/arrow-flight-iceberg-rest-catalog-columnar-transfers/).

## Summary of Technical Value

Arrow Flight SQL lets SQL engines return results as Arrow data over gRPC instead of converting them to rows for JDBC or ODBC. For lakehouse workloads that move large results into Arrow-native tools, it cuts serialization overhead and removes the need for a database-specific driver, especially when paired with ADBC on the client side.

## Learn More
To learn more about the Data Lakehouse, read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
