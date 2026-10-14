---
title: "What is Schema Registry?"
meta_title: "What is Schema Registry? | Data Lakehouse Hub Knowledge Base"
description: "A schema registry is a service that stores versioned Avro, Protobuf or JSON schemas for Kafka messages and checks compatibility as streams feed Iceberg tables."
---

# What is Schema Registry?

## Introduction to the Schema Registry

In event-driven architectures, many independent microservices communicate by publishing and subscribing to data streams via message brokers like [Apache Kafka](https://datalakehousehub.com/knowledgebase/apache-kafka/). 

A Python-based "Checkout Service" might publish thousands of "Order Events" to Kafka every second. A Java-based "Shipping Service" listens to that Kafka topic, reads the events, and prints shipping labels. 
If the Python team decides to rename the `customer_name` field to `full_name`, the Java service (which is strictly expecting `customer_name`) can fail when it reads the new event, and shipping stops.

In a decoupled architecture, emails or Slack messages are not a reliable way to coordinate schema changes. You need a central, programmatic service to enforce the structure of data as it moves between systems.

That service is the **Schema Registry**.

## How a Schema Registry Works

A Schema Registry (most notably the Confluent Schema Registry for Kafka) is an independent microservice that stores and retrieves schemas (usually written in [Apache Avro](https://iceberglakehouse.com/iceberg/iceberg-avro-format/), Protobuf, or JSON Schema). It acts as the shared reference for the structure of all messages flowing through the network.

### The Serialization Flow
The Schema Registry sits between the Producer (the app sending data) and the Consumer (the app reading data).

1.  **The Producer**: Before the Python Checkout Service sends a message to Kafka, its serializer registers or looks up its schema in the Schema Registry. The Registry checks the schema and returns a unique ID (e.g., `Schema ID: 42`).
2.  **The Payload**: Instead of sending the full schema definition with every Kafka message, the Producer writes the small `Schema ID: 42` at the front of the compact binary payload (Avro) and sends it to Kafka.
3.  **The Consumer**: The Java Shipping Service pulls the binary message from Kafka. It sees `Schema ID: 42`. If it hasn't seen this ID before, it makes an HTTP call to the Schema Registry: *"What is the structure for ID 42?"* The Registry returns the schema. The Java service caches it in memory, deserializes the binary payload, and processes the order.

## Enforcing Schema Evolution (Compatibility Rules)

A key feature of the Schema Registry is its role as a gatekeeper, enforcing **[Data Contracts](https://datalakehousehub.com/knowledgebase/data-contracts/)** through Compatibility Rules.

Because data changes, developers need to evolve schemas (add fields, remove fields). The Schema Registry lets administrators set rules on *how* schemas can evolve so that compatible changes do not break downstream services.

*   **Backward Compatibility**: The default in Confluent Schema Registry. If the Python team attempts to register a new schema (v2), the Schema Registry checks it against the latest schema (v1). If v2 adds a required field with no default value, the Registry *rejects* the new schema, and the producer gets an error instead of publishing. This rule means consumers that upgrade to v2 can still read data written with v1.
*   **Forward Compatibility**: Consumers still using the previous schema can read data written with the new schema.
*   **Full Compatibility**: The new schema is both backward and forward compatible.

## The Impact on the Data Lakehouse

While Schema Registries were born in the software engineering / microservices world, they are a common component of the [Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/).

When an ingestion engine (like [Apache Flink](https://datalakehousehub.com/knowledgebase/apache-flink/) or Kafka Connect) reads CDC (Change Data Capture) streams from Kafka to populate an [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/) table, it uses the Schema Registry to decode each message. 
If the upstream database schema evolves (e.g., a new column is added), records arrive with a new Schema ID. Pipelines configured for schema evolution can then add the column to the Iceberg table, keeping the lakehouse schema in step with the source.

## Conclusion

In a distributed, event-driven enterprise, the Schema Registry is a central safeguard for message structure. By separating the schema from the data payload and enforcing compatibility rules during evolution, the Registry helps independent teams change and deploy their services without breaking the data pipelines the business depends on.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
