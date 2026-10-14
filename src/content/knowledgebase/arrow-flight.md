---
title: "Arrow Flight"
meta_title: "What is Arrow Flight? | Data Lakehouse & AI Glossary"
description: "Arrow Flight is an RPC framework for sending Apache Arrow columnar data over the network without row conversion, moving query results from engines to clients."
---

Arrow Flight is an RPC framework from the [Apache Arrow](/knowledgebase/apache-arrow/) project for moving large datasets between processes over a network. It is built on gRPC and the Arrow IPC format, and it sends data as streams of Arrow record batches. Because both sides already use Arrow's columnar memory layout, Flight avoids converting data into rows and back, the serialization step that slows down traditional database protocols such as ODBC and JDBC when they move large result sets.

## How Arrow Flight Works

Flight defines a small set of RPC methods, specified with Protocol Buffers, that clients and servers use to describe and exchange data:

* **GetFlightInfo** takes a FlightDescriptor (a path or an opaque command, such as a query) and returns a FlightInfo describing the dataset: its schema, size estimates, and a list of endpoints.
* **DoGet** redeems a ticket from one of those endpoints and returns a stream of record batches.
* **DoPut** uploads a stream of record batches to the server.
* **DoExchange** opens a bidirectional stream so a client can send and receive data in one call.
* **ListFlights, GetSchema, DoAction, ListActions, and Handshake** cover discovery, schema lookup, custom commands, and authentication. **PollFlightInfo** supports long-running queries by returning progress until the result is ready.

The key design idea is the endpoint. A FlightInfo can list several endpoints, each with a ticket (an opaque token the server uses to identify part of the data) and one or more locations where that ticket can be redeemed. A client can fetch endpoints in any order, in parallel, and from different machines. A distributed engine can therefore hand a client tickets for each executor's share of a result and let the client pull those streams concurrently, instead of funneling everything through a single coordinator connection.

## Arrow Flight Versus Flight SQL and ADBC

Flight itself only moves Arrow data; it does not define SQL. Two related projects build on it:

| Technology | What it is | Role |
|---|---|---|
| Arrow Flight | RPC framework for Arrow data streams | Transport between any Arrow-aware client and server |
| [Arrow Flight SQL](/knowledgebase/arrow-flight-sql/) | Protocol on top of Flight for SQL databases | Standard commands for queries, prepared statements, and catalog metadata |
| ADBC | Arrow Database Connectivity, a client API | Driver interface that returns Arrow data; one driver speaks Flight SQL |
| JDBC and ODBC | Row-oriented driver standards | Widely supported by BI tools, but values are converted to rows |

## Arrow Flight in the Lakehouse

In a lakehouse, the slowest part of a query is often not the scan of Parquet files in object storage but the transfer of results to the client: a notebook, a Python data pipeline, or a BI tool. Engines that compute in Arrow internally can stream results out over Flight without a row conversion.

Dremio is a common example. Its documentation lists Arrow Flight SQL JDBC and ODBC drivers for tools such as DBeaver, Tableau, and Excel, an ADBC Flight SQL driver for Power BI, and PyArrow or the Flight SQL JDBC driver for custom applications. Flight connections to Dremio use TLS by default. Data scientists can pull query results from [Apache Iceberg](/knowledgebase/apache-iceberg/) tables straight into a PyArrow table or a pandas or Polars DataFrame, and DuckDB can query those Arrow tables in the same process.

Flight is also used for services beyond SQL engines: feature stores, data APIs, and custom microservices that need to move columnar data between languages, since Arrow has implementations in C++, Java, Python, Rust, Go, and other languages.

## Related Reading

* [Apache Arrow Flight and ADBC, and Why Database Connectivity Finally Went Columnar](/blog/arrow-flight-adbc-explained/)
* [Arrow Flight SQL and ADBC: Why the Database Driver Is the Slowest Part of Your Query](/blog/arrow-flight-sql-adbc-connectivity/)
* [Columnar format](/knowledgebase/columnar-format/)

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
