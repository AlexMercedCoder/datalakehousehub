---
title: "Microservices Data in a Lakehouse: CDC, Outbox Events, and Iceberg"
meta_title: "Microservices Data Into a Lakehouse: CDC and Iceberg"
description: "Microservices split an application into small services that deploy and scale on their own. Learn how to move data from many service databases into Iceberg."
---

Microservices (or microservice architecture) is a way of building an application as a set of small, independently deployable services, each responsible for one business capability such as payments, inventory, or notifications. It contrasts with a [monolith](/knowledgebase/monolithic-architecture/), where those capabilities ship together as one codebase and one deployment.

Services communicate over the network, usually through HTTP or gRPC APIs, or asynchronously through message brokers and event streams such as Apache Kafka. A common guideline is that each service owns its data and other services reach that data only through the owning service's API or events, not by querying its database directly.

## Why Teams Adopt Microservices

In a monolith, a bad change in one module can take down the whole application, and scaling one busy feature means scaling everything. Microservices address this with:

* **Independent scaling:** if search traffic spikes, an orchestrator such as Kubernetes can add replicas of the search service without touching payments.
* **Fault isolation:** if the email service fails, checkout can still succeed and the receipt is sent once the service recovers, provided the calls between services are designed for that (timeouts, retries, queues).
* **Independent deployment and technology choice:** teams release on their own schedules and can use the language or database that fits their service.

## The Costs

Microservices move complexity from the codebase into the network. Teams take on service discovery, distributed tracing, versioned APIs, partial failures, and eventual consistency between services. Many organizations start with a well-structured monolith and split out services only where independent scaling or ownership pays for that overhead.

## The Analytics Problem

Database-per-service is good for team autonomy and bad for analytics. The user service may run PostgreSQL and the inventory service MongoDB. A question like "which users bought items that are now out of stock" spans both, and there is no single database to join them in. Querying service databases directly for analytics also couples reports to internal schemas and adds load to production systems.

The usual answer is to copy service data into a shared analytical store. A [data lakehouse](/knowledgebase/data-lakehouse/) built on [Apache Iceberg](/knowledgebase/apache-iceberg/) fits well because several engines and teams can use the same tables.

## Getting Microservice Data into Iceberg

| Pattern | How it works | Tradeoffs |
|---|---|---|
| [Change data capture](/knowledgebase/change-data-capture/) | A tool such as [Debezium](/knowledgebase/debezium/) reads each service database's transaction log and streams row changes to Kafka | No application changes; exposes internal table structure, so schema changes can break consumers |
| Transactional outbox | The service writes business events to an outbox table in the same transaction as its data change; CDC publishes the outbox | Events are a deliberate contract; requires work in each service |
| Domain events | Services publish events to Kafka as part of their normal design, often with a [schema registry](/knowledgebase/schema-registry/) | Clean contracts; analytics depends on what services choose to emit |
| Batch extracts | Scheduled exports or API pulls | Simple; higher latency and more load on sources |

From Kafka, the Iceberg Kafka Connect sink or a Flink job writes the changes into Bronze Iceberg tables, and Silver and Gold tables join data across services. For how those commits work, read [Kafka Connect to Iceberg: How the Commit Actually Works](/blog/kafka-connect-iceberg-commits/). For CDC table design, see [What Iceberg V3 Advances Mean for CDC Pipelines](/blog/2026-05-iceberg-cdc-pipelines/).

## Summary

Microservices let teams scale, deploy, and fail independently at the cost of distributed systems complexity. Because each service keeps its own data, analytics needs a shared layer. CDC, outbox events, and streaming into Iceberg tables give the business one place to query across services without reaching into production databases.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
